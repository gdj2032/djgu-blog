import pageRoutes from '@/pages/pageRoutes'
import {
  Home, Login, User
} from '@/pages';
import { RouteObject } from 'react-router/dist/lib/context';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotFound from '../404';
import Index from '../index'

export const PathConfig = {
  index: '/',
  ...pageRoutes,
};

function Redirect({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

export const loginRoute: RouteObject[] = [
  {
    element: <Redirect to={PathConfig.login} />,
    path: '*'
  },
  {
    element: <Login />,
    path: PathConfig.login,
  },
];

export const pageRoute = (): RouteObject[] => [
  {
    path: PathConfig.index,
    element: <Index />,
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
    path: PathConfig.user,
    element: <User />,
  },
  {
    path: '*',
    element: <NotFound />
  }
];
