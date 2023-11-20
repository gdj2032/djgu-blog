/*
 * @Author: djgu djgu@tmindtech.com
 * @Date: 2023-07-20 14:24:19
 * @LastEditors: djgu djgu@tmindtech.com
 * @LastEditTime: 2023-10-12 13:53:37
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
import pageRoutes from '@/pages/pageRoutes'
import {
  Home,
  Login,
  User,
  Document,
  DocumentDetail,
  DocumentCreate,
  Knowledge,
  Tools,
  ToolsCrawlers,
  Content,
} from '@/pages';
import { RouteObject } from 'react-router/dist/lib/context';
import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import NotFound from '../404';

export const PathConfig = {
  index: '/',
  ...pageRoutes,
};

// function Redirect({ to }: { to: string }) {
//   const navigate = useNavigate();
//   useEffect(() => {
//     navigate(to);
//   });
//   return null;
// }

// export const loginRoute: RouteObject[] = [
//   {
//     element: <Redirect to={PathConfig.login} />,
//     path: '*'
//   },
//   {
//     element: <Login />,
//     path: PathConfig.login,
//   },
// ];

export const pageRoute = (): RouteObject[] => [
  {
    path: PathConfig.index,
    element: <Home />,
  },
  {
    path: PathConfig.home,
    element: <Home />,
  },
  {
    path: PathConfig.login,
    element: <Login />,
  },
  {
    path: PathConfig.admin,
    element: <User />,
  },
  {
    path: PathConfig.document,
    element: <Document />,
  },
  {
    path: PathConfig.documentDetail,
    element: <DocumentDetail />,
  },
  {
    path: PathConfig.documentCreate,
    element: <DocumentCreate />,
  },
  {
    path: PathConfig.knowledge,
    element: <Knowledge />,
  },
  {
    path: PathConfig.tools,
    element: <Tools />,
  },
  {
    path: PathConfig.toolsCrawlers,
    element: <ToolsCrawlers />,
  },
  {
    path: '*',
    element: <Content />
  },
  {
    path: '*/*',
    element: <Content />
  },
];
