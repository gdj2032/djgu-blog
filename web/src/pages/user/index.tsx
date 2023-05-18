import React from 'react';
import './index.scss';

interface IProps {
}

function User(props: IProps) {
  return (
    <div className="User">User 1</div>
  )
}

User.displayName = 'User';

export default User;
