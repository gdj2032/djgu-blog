/**
 * 404
 */
import React from 'react';
import './index.scss';
import Image404 from '@/images/404.png'

function NotFound() {
  return (
    <div className='g-not-found'>
      <img src={Image404} className="m-404-img" />
      <div className="m-404-content">抱歉，您访问的页面不存在。</div>
    </div>
  )
}

NotFound.displayName = 'NotFound';

export default NotFound;
