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
  ToolsData2Interface,
  IndexPage,
} from '@/pages';
import { RouteObject } from 'react-router/dist/lib/context';
import ContainerPage from '../container';
// import { useNavigate } from 'react-router-dom';
// import NotFound from '../404';

export const PathConfig = {
  // index: '/',
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
//     Component: Redirect={PathConfig.login} />,
//     path: '*'
//   },
//   {
//     Component: Login,
//     path: PathConfig.login,
//   },
// ];

export const pageRoute = (): RouteObject[] => [
  {
    path: PathConfig.login,
    Component: Login,
  },
  {
    path: PathConfig.home,
    Component: Home,
  },
  {
    id: 'container',
    path: '/',
    Component: ContainerPage,
    children: [
      {
        path: PathConfig.index,
        Component: IndexPage,
      },
      {
        path: PathConfig.admin,
        Component: User,
      },
      {
        path: PathConfig.document,
        Component: Document,
      },
      {
        path: PathConfig.documentDetail,
        Component: DocumentDetail,
      },
      {
        path: PathConfig.documentCreate,
        Component: DocumentCreate,
      },
      {
        path: PathConfig.knowledge,
        Component: Knowledge,
      },
      {
        path: PathConfig.tools,
        Component: Tools,
      },
      {
        path: PathConfig.toolsCrawlers,
        Component: ToolsCrawlers,
      },
      {
        path: PathConfig.toolsData2Interface,
        Component: ToolsData2Interface,
      },
      // {
      //   path: '*',
      //   Component: IndexPage
      // },
    ]
  },
  {
    path: '*',
    Component: Content
  },
];
