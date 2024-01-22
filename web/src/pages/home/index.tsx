/**
 * 文档列表
 */
import React, { useEffect, useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router';
import { Button } from 'antd';
import HeaderBar from '@/framework/headerBar';

function Home() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  return (
    <div className='g-home'>
      <div className='m-app-name'>
        开发随笔
      </div>
      <Button type='primary'>TO INDEX</Button>

      <div
        className={`m-hb ${show ? 'm-hb-show' : ''}`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onMouseOver={() => setShow(true)}
        onMouseOut={() => setShow(false)}
      >
        <HeaderBar />
      </div>
    </div>
  )
}

Home.displayName = 'Home';

export default Home;
