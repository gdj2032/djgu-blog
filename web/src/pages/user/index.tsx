import React from 'react';
import './index.scss';
import { USER_TAB, USER_ROLE } from '@/constants';
import UserList from './comps/UserList';
import DocumentType from './comps/DocumentType';
import { Tabs } from 'antd';

function User() {

  const tabs = [
    { key: USER_TAB.user, label: '用户列表', children: <UserList /> },
    { key: USER_TAB.documentType, label: '文档类型', children: <DocumentType /> },
  ]

  if (!USER_ROLE.isAdminForSelf()) {
    return <div>暂无权限</div>
  }
  return (
    <div className="g-user">
      <Tabs items={tabs}></Tabs>
    </div>
  )
}

User.displayName = 'User';

export default User;
