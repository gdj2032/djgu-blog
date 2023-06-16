import pageRoutes from '@/pages/pageRoutes';
import { ReactNode } from 'react';
import { Icon } from '@/components';
import React from 'react';

export interface INavFormat {
  label: string;
  key: string;
  icon?: ReactNode;
  children?: INavFormat[];
  admin?: boolean;
}

export const menuConfig: INavFormat[] = [
  {
    label: '首页',
    key: pageRoutes.home,
    icon: <Icon name="home" fill="#fff" />
  },
  {
    label: '文档',
    key: pageRoutes.document,
    icon: <Icon name="documents" fill="#fff" />
  },
  {
    label: '管理',
    key: pageRoutes.user,
    admin: true,
    icon: <Icon name="admin" fill="#fff" />
  },
]
