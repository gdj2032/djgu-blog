import routeList from '../routes/routeList';
import { Routes } from 'react-router';
import { RouteObject } from 'react-router/dist/lib/context';
import Header from '../header';
import { Layout } from 'antd';
import Aside from '../aside';
import React from 'react';
import './index.scss';

const { Content } = Layout

interface IContainerProps {
  routes: RouteObject[]
}

function ContainerPage(props: IContainerProps) {
  const { routes = [] } = props;
  return (
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
  );
}

export default ContainerPage
