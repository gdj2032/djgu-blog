/*
 * @Author: djgu djgu@tmindtech.com
 * @Date: 2023-10-07 13:53:23
 * @LastEditors: djgu djgu@tmindtech.com
 * @LastEditTime: 2023-10-12 13:58:16
 * @Description: 工具
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
import { TBreadcrumb } from '@/components';
import { PathConfig } from '@/framework/routes/routes';
import { Button, Card } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';
import './index.scss';

function Tools() {

  const navigate = useNavigate()
  const route = [
    { name: '工具' },
  ]
  return (
    <div className='g-tools'>
      <TBreadcrumb route={route} />
      <Card style={{ marginTop: 20 }}>
        {/* <a onClick={() => navigate(PathConfig.toolsCrawlers)}>爬虫</a> */}
        <Button type='link' onClick={() => navigate(PathConfig.toolsData2Interface)}>数据转接口</Button>
      </Card>
    </div>
  )
}

Tools.displayName = 'Tools';

export default Tools;
