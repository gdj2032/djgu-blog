import { DownAnimation } from '@/components';
import { Content } from '@/pages';
import { routeAction, useAppSelector } from '@/stores';
import React, { useEffect } from 'react';
import { HashRouter, Routes } from 'react-router-dom';
import routeList from './routeList';
import { pageRoute } from './routes';

const Roots = () => {

  const { routes: storeRoutes } = useAppSelector(routeAction.routeInfo)
  const routes = pageRoute().concat(storeRoutes.map(e => ({ path: e.path, element: <Content /> })));
  // const [local, setLocal] = useState(window.location.hash.replace('#', ''))

  useEffect(() => {
    const browserLanguage = (navigator.language || navigator.language).toLowerCase().split(/[-_]/)[0];
    console.info('🚀 ~ file: index.tsx ~ line 40 ~ useEffect ~ browserLanguage', browserLanguage)
    // window.onhashchange = () => {
    //   setLocal(window.location.hash.replace('#', ''))
    // }
    const move = new DownAnimation()
    move.start()
  }, [])

  return (
    <HashRouter>
      <Routes>
        {routeList(routes)}
      </Routes>
    </HashRouter>
  );
}

export default Roots;
