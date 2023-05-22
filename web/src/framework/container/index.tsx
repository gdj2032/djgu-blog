import routeList from '../routes/routeList';
import { Routes } from 'react-router';
import { RouteObject } from 'react-router/dist/lib/context';
import Header from '../header';
import { Layout } from 'antd';
import Aside from '../aside';
import React from 'react';
import './index.scss';
import PageFrame from '@/components/PageFrame';
import { PathConfig } from '../routes/routes';

const { Content } = Layout

interface IContainerProps {
  routes: RouteObject[]
}

function ContainerPage(props: IContainerProps) {
  const { routes = [] } = props;
  if (window.location.hash.replace('#', '') === PathConfig.index || window.location.hash === '') {
    return (
      <Routes>
        {routeList(routes)}
      </Routes>
    )
  }
  return (
    <PageFrame>
      <Layout className="g-container">
        <Header />
        <Layout>
          <Aside />
          <Content className="layout-content">
            <div id="micro-app" />
            <Routes>
              {routeList(routes)}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </PageFrame>
  );
}

export default ContainerPage
