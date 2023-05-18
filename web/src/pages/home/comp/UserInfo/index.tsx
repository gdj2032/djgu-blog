import React, { useState } from 'react';
import './index.scss';
import { useAppDispatch, useAppSelector, userAction } from '@/stores';
import { Button, Input } from 'antd';

interface IProps {
}

function UserInfo(props: IProps) {
  const user = useAppSelector(userAction.userInfo);
  const dispatch = useAppDispatch();
  // console.log(user)
  const [id, setId] = useState('');
  const [userName, setUserName] = useState('');

  const handleUserInfo = () => {
    // console.log(id, userName)
    dispatch(userAction.setUserInfo({ id, username: userName }))
  }
  return (
    <div className="UserInfo">
      <h1>UserInfo</h1>
      <Input placeholder="请输入Id" value={id} onChange={e => setId(e.target.value)} style={{ width: 200 }} />
      <Input placeholder="请输入UserName" value={userName} onChange={e => setUserName(e.target.value)} style={{ width: 200 }} />
      <Button onClick={handleUserInfo}>修改用户信息</Button>
      <div>
        UserId: {user.id}
      </div>
      <div>
        UserName: {user.username}
      </div>
    </div>
  );
}

UserInfo.displayName = 'UserInfo';

export default UserInfo;
