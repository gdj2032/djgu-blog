import { DownAnimation, PageFrame } from '@/components';
import { isElectron } from '@/constants';
import { Content } from '@/pages';
import { routeAction, sysAction, useAppSelector } from '@/stores';
import React, { useEffect, useMemo } from 'react';
import { HashRouter, Routes } from 'react-router-dom';
import routeList from './routeList';
import { pageRoute, PathConfig } from './routes';

const Roots = () => {

  const sys = useAppSelector(sysAction.sysInfo);
  const { routes: storeRoutes } = useAppSelector(routeAction.routeInfo)

  const routes = useMemo(() => {
    const r = [...pageRoute()]
    const r2 = storeRoutes.map(e => ({ path: e.path, Component: Content }))
    for (const i of r) {
      if (i.id === 'container') {
        const r3 = r2.filter(e => !i.children.find(v => v.path === e.path))
        i.children = i.children.concat(r3)
      }
    }
    return r;
  }, [storeRoutes])

  useEffect(() => {
    // const browserLanguage = (navigator.language || navigator.language).toLowerCase().split(/[-_]/)[0];
    const move = new DownAnimation()
    move.start()
  }, [])

  useEffect(() => {
    if (window.location.hash === '#/') {
      window.location.hash = PathConfig.home
    }
  }, [window.location.hash])

  return (
    <PageFrame className={sys.mode} hideTitleBar={!isElectron}>
      <HashRouter>
        <Routes>
          {routeList(routes)}
        </Routes>
      </HashRouter>
    </PageFrame>
  );
}

export default Roots;
