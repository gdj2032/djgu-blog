import { useAppSelector, userAction } from '@/stores';
import React, { useEffect } from 'react';
import { HashRouter, Routes } from 'react-router-dom';
import ContainerPage from '../container';
import routeList from './routeList';
import { loginRoute, pageRoute } from './routes';

const Roots = () => {
  useEffect(() => {
    const browserLanguage = (navigator.language || navigator.language).toLowerCase().split(/[-_]/)[0];
    console.info('🚀 ~ file: index.tsx ~ line 40 ~ useEffect ~ browserLanguage', browserLanguage)
  })
  const user = useAppSelector(userAction.userInfo);
  const routes = pageRoute();
  const getContainer = () => {
    return <ContainerPage routes={routes} />
    // if (user?.id) {
    //   return <ContainerPage routes={routes} />
    // }
    // return (
    //   <Routes>
    //     {routeList(loginRoute)}
    //   </Routes>
    // )
  }
  return (
    <HashRouter>
      {getContainer()}
    </HashRouter>
  );
}

export default Roots;
