import React from 'react';
import { useNavigate } from 'react-router';
import { PathConfig } from '../routes/routes';
import './index.scss';

interface IProps {
}

function Logo(props: IProps) {
  const navigate = useNavigate()

  return (
    <div className='g-logo' onClick={() => navigate(PathConfig.home)}>
      {/* <div className='m-l'>G</div>
      <div className='m-c'>D</div>
      <div className='m-r'>J</div> */}
      <div className='m-logo1'>G</div>
      <div className='m-logo2'>Blog</div>
    </div>
  )
}

Logo.displayName = 'Logo';

export default Logo;
