/*
 * @Author: djgu djgu@tmindtech.com
 * @Date: 2023-07-20 14:24:19
 * @LastEditors: djgu djgu@tmindtech.com
 * @LastEditTime: 2023-10-12 14:02:29
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
import routeList from '../routes/routeList';
import { Routes } from 'react-router';
import { RouteObject } from 'react-router/dist/lib/context';
import { Layout } from 'antd';
import React, { useEffect } from 'react';
import './index.scss';
import { Content } from 'antd/es/layout/layout';
import { initRoutes } from '@/utils';
import HeaderBar from '../headerBar';

interface IContainerProps {
  routes: RouteObject[]
}

function ContainerPage(props: IContainerProps) {
  const { routes = [] } = props;

  useEffect(() => {
    initRoutes()
  }, [])

  return (
    <Layout className="g-container">
      <HeaderBar />
      <Layout>
        <Content className="layout-content">
          <Routes>
            {routeList(routes)}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ContainerPage
