import { useAppSelector, userAction } from '@/stores';
import React, { useEffect, useState, useMemo } from 'react';
import { HashRouter, Routes } from 'react-router-dom';
import ContainerPage from '../container';
import routeList from './routeList';
import { loginRoute, pageRoute, PathConfig } from './routes';
import { isElectron } from '@/constants';

const Roots = () => {
  const user = useAppSelector(userAction.userInfo);
  const routes = pageRoute();
  const [local, setLocal] = useState(window.location.hash.replace('#', ''))

  console.info('--- local --->', local);

  useEffect(() => {
    const browserLanguage = (navigator.language || navigator.language).toLowerCase().split(/[-_]/)[0];
    console.info('🚀 ~ file: index.tsx ~ line 40 ~ useEffect ~ browserLanguage', browserLanguage)

    window.onhashchange = () => {
      setLocal(window.location.hash.replace('#', ''))
    }
  }, [])

  const getContainer = useMemo(() => {
    if (isElectron) {
      if (user?.id) {
        return <ContainerPage routes={routes} />
      }
      return (
        <Routes>
          {routeList(loginRoute)}
        </Routes>
      )
    }
    if (local === PathConfig.index || local === '') {
      return (
        <Routes>
          {routeList(routes)}
        </Routes>
      )
    }
    return <ContainerPage routes={routes} />
  }, [local, routes, user?.id])
  return (
    <HashRouter>
      {getContainer}
    </HashRouter>
  );
}

export default Roots;
