/**
 * useTransition
 */
import React from 'react';

interface IProps {
}

const mockList1 = new Array(10000).fill('tab1').map((item, index) => item + '--' + index)
const mockList2 = new Array(10000).fill('tab2').map((item, index) => item + '--' + index)
const mockList3 = new Array(10000).fill('tab3').map((item, index) => item + '--' + index)

const tab = {
  tab1: mockList1,
  tab2: mockList2,
  tab3: mockList3
}

function TestUseDeferredValue(props: IProps) {
  const [active, setActive] = React.useState('tab1') //需要立即响应的任务，立即更新任务
  const deferActive = React.useDeferredValue(active) // 把状态延时更新，类似于过渡任务
  const handleChangeTab = (activeItem) => {
    setActive(activeItem) // 立即更新
  }
  const renderData = tab[deferActive] // 使用滞后状态
  return <div>
    <div className='tab'>
      {Object.keys(tab).map((item) => <span className={active === item && 'active'} onClick={() => handleChangeTab(item)} >{item}</span>)}
    </div>
    <ul className='content' >
      {renderData.map(item => <li key={item} >{item}</li>)}
    </ul>
  </div>
}

TestUseDeferredValue.displayName = 'TestUseDeferredValue';

export default TestUseDeferredValue;
