/**
 * 文档列表
 */
import React, { useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router';
import { Button } from 'antd';
import HeaderBar from '@/framework/headerBar';
import { PathConfig } from '@/framework/routes/routes';
import { useDispatch } from 'react-redux';
import { routeAction } from '@/stores';
import { DEFAULT_ROUTE_OPTION } from '@/constants';

function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)

  return (
    <div className='g-home'>
      <div className='m-app-name'>
        开发随笔
      </div>
      <Button type='primary' onClick={() => {
        navigate(PathConfig.index)
        dispatch(routeAction.setCurrentRoute(DEFAULT_ROUTE_OPTION[0]))
      }}>TO INDEX</Button>
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
