import React, { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import ContainerPage from '../container';
import { pageRoute } from './routes';

const Roots = () => {
  const routes = pageRoute();
  // const [local, setLocal] = useState(window.location.hash.replace('#', ''))

  useEffect(() => {
    const browserLanguage = (navigator.language || navigator.language).toLowerCase().split(/[-_]/)[0];
    console.info('🚀 ~ file: index.tsx ~ line 40 ~ useEffect ~ browserLanguage', browserLanguage)
    // window.onhashchange = () => {
    //   setLocal(window.location.hash.replace('#', ''))
    // }
  }, [])

  return (
    <HashRouter>
      <ContainerPage routes={routes} />
    </HashRouter>
  );
}

export default Roots;
