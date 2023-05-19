import { useAppSelector, userAction } from '@/stores';
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes } from 'react-router-dom';
import ContainerPage from '../container';
import routeList from './routeList';
import { loginRoute, pageRoute, PathConfig } from './routes';
import { isElectron } from '@/constants';

const Roots = () => {
  const user = useAppSelector(userAction.userInfo);
  const routes = pageRoute();

  useEffect(() => {
    const browserLanguage = (navigator.language || navigator.language).toLowerCase().split(/[-_]/)[0];
    console.info('🚀 ~ file: index.tsx ~ line 40 ~ useEffect ~ browserLanguage', browserLanguage)
  }, [])

  const getContainer = () => {
    console.info('--- window.location.pathname --->', window.location);
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
    if (window.location.hash.replace('#', '') === PathConfig.index) {
      return (
        <Routes>
          {routeList(routes)}
        </Routes>
      )
    }
    return <ContainerPage routes={routes} />
  }
  return (
    <HashRouter>
      {getContainer()}
    </HashRouter>
  );
}

export default Roots;
