/**
 * tab路由公共页面 不存在显示404
 */
import NotFound from '@/framework/404';
import { routeAction, useAppSelector } from '@/stores';
import React from 'react';
import './index.scss';

function Content() {
  const { currentRoute } = useAppSelector(routeAction.routeInfo)
  if (!currentRoute?.id) {
    return <NotFound />;
  }
  return (
    <div className='Content'>Content</div>
  )
}

Content.displayName = 'Content';

export default Content;
