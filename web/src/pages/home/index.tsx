import React from 'react'
import './index.scss';
import { Icon, TBreadcrumb, TSearch } from '@/components';
import UserInfo from './comp/UserInfo';
import { IFormItem } from '@/components/TForm';
import { Card } from 'antd';

const Home = () => {

  const formItems: IFormItem[] = [
    { id: 'name1', label: '名称1', type: 'input' },
    { id: 'name2', label: '名称2', type: 'input' },
    { id: 'name3', label: '名称3', type: 'input' },
  ]
  return (
    <div className="g-home">
      <TBreadcrumb route={[{ name: '微前端-主应用' }]} />
      <Card title="表单">
        <TSearch searchItems={formItems} onSearch={() => { }} />
      </Card>
      {/* <div>{'multi-language'.localeString()}</div> */}
      <Icon name="camera" fill="#0f0" />
      <UserInfo />
    </div>
  )
}

export default Home
