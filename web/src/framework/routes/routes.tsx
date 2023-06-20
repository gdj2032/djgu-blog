import pageRoutes from '@/pages/pageRoutes'
import {
  Home, Login, User, Document, DocumentDetail, DocumentCreate, Latest,
} from '@/pages';
import { RouteObject } from 'react-router/dist/lib/context';
import React from 'react';
// import { useNavigate } from 'react-router-dom';
import NotFound from '../404';

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
    path: PathConfig.latest,
    element: <Latest />,
  },
  {
    path: PathConfig.user,
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
    path: '*',
    element: <NotFound />
  }
];
