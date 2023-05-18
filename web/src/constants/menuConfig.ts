import pageRoutes from '@/pages/pageRoutes';
import { ReactNode } from 'react';

export interface INavFormat {
  label: string;
  key: string;
  icon?: ReactNode;
  children?: INavFormat[];
}

export const menuConfig: INavFormat[] = [
  {
    label: '首页',
    key: pageRoutes.home,
    icon: 'home',
  },
  {
    label: '用户',
    key: pageRoutes.user,
    icon: 'user',
  },
  {
    label: '子应用',
    key: '/react-admin-template',
    icon: 'home',
  },
]
