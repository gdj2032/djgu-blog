import pageRoutes from '@/pages/pageRoutes';
import { ReactNode } from 'react';

export interface INavFormat {
  label: string;
  key: string;
  icon?: ReactNode;
  children?: INavFormat[];
  admin?: boolean;
}

export const menuConfig: INavFormat[] = [
  {
    label: '最近更新',
    key: pageRoutes.home,
  },
  {
    label: '文档',
    key: pageRoutes.document,
  },
  {
    label: '管理员',
    key: pageRoutes.user,
    admin: true,
  },
]
