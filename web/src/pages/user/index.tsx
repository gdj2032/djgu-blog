import React, { useState } from 'react';
import './index.scss';
import { USER_TAB, USER_ROLE } from '@/constants';
import UserList from './comps/UserList';
import { Tabs } from 'antd';
import Document from './comps/Document';
import { useQuery } from '@djgu/react-comps';
import Version from './comps/Version';
import RouteView from './comps/RouteView';
import NotFound from '@/framework/404';
import TagView from './comps/TagView';

function User() {
  const { current: cur = USER_TAB.user } = useQuery()
  const [current, setCurrent] = useState(cur)
  const tabs = [
    { key: USER_TAB.user, label: '用户列表', children: <UserList /> },
    { key: USER_TAB.route, label: '路由配置', children: <RouteView /> },
    { key: USER_TAB.tag, label: '标签配置', children: <TagView /> },
    { key: USER_TAB.document, label: '文档列表', children: <Document /> },
    { key: USER_TAB.nginx, label: '版本配置', children: <Version /> },
  ]

  if (!USER_ROLE.isAdminForSelf()) {
    return <NotFound />
  }
  return (
    <div className="g-user">
      <Tabs items={tabs} activeKey={current} onChange={setCurrent}></Tabs>
    </div>
  )
}

User.displayName = 'User';

export default User;
