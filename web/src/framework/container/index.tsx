/*
 * @Author: djgu djgu@tmindtech.com
 * @Date: 2023-07-20 14:24:19
 * @LastEditors: djgu djgu@tmindtech.com
 * @LastEditTime: 2023-10-12 14:02:29
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
import routeList from '../routes/routeList';
import { Routes, useLocation } from 'react-router';
import { RouteObject } from 'react-router/dist/lib/context';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.scss';
import PageFrame from '@/components/PageFrame';
import { sysAction, tabRouteAction, useAppSelector } from '@/stores';
import { isElectron } from '@/constants';
import { routeService } from '@/services';
import { useDispatch } from 'react-redux';
import { Content } from 'antd/es/layout/layout';
import Aside from '../aside';
import Header from '../header';

interface IContainerProps {
  routes: RouteObject[]
}

function ContainerPage(props: IContainerProps) {
  const { pathname } = useLocation()
  const sys = useAppSelector(sysAction.sysInfo);
  const [local, setLocal] = useState(pathname)
  const dispatch = useDispatch()
  const { routes = [] } = props;
  useEffect(() => {
    setLocal(pathname)
  }, [pathname])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const res = await routeService.dList({ limit: 10000, offset: 0 })
    dispatch(tabRouteAction.setTabRouteInfo({ routes: res.data.data, currentRoute: res.data.data?.[0] }))
  }

  return (
    <PageFrame className={sys.mode} hideTitleBar={!isElectron}>
      <Layout className="g-container">
        <Header />
        <Layout>
          <Aside />
          <Content className="layout-content">
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
