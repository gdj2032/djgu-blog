import routeList from '../routes/routeList';
import { Routes, useLocation } from 'react-router';
import { RouteObject } from 'react-router/dist/lib/context';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.scss';
import PageFrame from '@/components/PageFrame';
import FixedView from '../fixedView';
import { sysAction, useAppSelector, userAction } from '@/stores';
import { isElectron } from '@/constants';
import { PathConfig } from '../routes/routes';

interface IContainerProps {
  routes: RouteObject[]
}

function ContainerPage(props: IContainerProps) {
  const { pathname } = useLocation()
  const user = useAppSelector(userAction.userInfo);
  const sys = useAppSelector(sysAction.sysInfo);
  const [local, setLocal] = useState(pathname)
  const { routes = [] } = props;
  useEffect(() => {
    setLocal(pathname)
  }, [pathname])
  return (
    <PageFrame className={sys.mode} hideTitleBar={!isElectron}>
      <FixedView menuShow={isElectron ? !!user?.id : true} modeShow={!local.includes(PathConfig.documentCreate) && !local.includes(PathConfig.knowledge)} />
      <Layout className="g-container">
        <Routes>
          {routeList(routes)}
        </Routes>
      </Layout>
    </PageFrame>
  );
}

export default ContainerPage
