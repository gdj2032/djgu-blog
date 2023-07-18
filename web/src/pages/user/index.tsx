import React, { useState } from 'react';
import './index.scss';
import { USER_TAB, USER_ROLE } from '@/constants';
import UserList from './comps/UserList';
import DocumentType from './comps/DocumentType';
import { Tabs } from 'antd';
import Document from './comps/Document';
import { useQuery } from '@djgu/react-comps';
import Version from './comps/Version';

function User() {
  const { current: cur = USER_TAB.user } = useQuery()
  const [current, setCurrent] = useState(cur)
  const tabs = [
    { key: USER_TAB.user, label: '用户列表', children: <UserList /> },
    { key: USER_TAB.documentType, label: '文档类型', children: <DocumentType /> },
    { key: USER_TAB.document, label: '文档列表', children: <Document /> },
    { key: USER_TAB.nginx, label: '版本配置', children: <Version /> },
  ]

  if (!USER_ROLE.isAdminForSelf()) {
    return <div>暂无权限</div>
  }
  return (
    <div className="g-user">
      <Tabs items={tabs} activeKey={current} onChange={setCurrent}></Tabs>
    </div>
  )
}

User.displayName = 'User';

export default User;
