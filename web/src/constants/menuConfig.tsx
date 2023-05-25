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
    label: '最近',
    key: pageRoutes.home,
    icon: <Icon name="latest" fill="#fff" />
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
