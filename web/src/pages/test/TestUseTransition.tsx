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

function TestUseTransition(props: IProps) {
  const [active, setActive] = React.useState('tab1') //需要立即响应的任务，立即更新任务
  const [renderData, setRenderData] = React.useState(tab[active]) //不需要立即响应的任务，过渡任务
  const [isPending, startTransition] = React.useTransition()
  const handleChangeTab = (activeItem) => {
    setActive(activeItem) // 立即更新
    startTransition(() => { // startTransition 里面的任务优先级低
      setRenderData(tab[activeItem])
    })
  }
  return (
    <div className='TestUseTransition'>
      <div className='tab' >
        {Object.keys(tab).map((item) => <span className={active === item && 'active'} onClick={() => handleChangeTab(item)} >{item}</span>)}
      </div>
      <ul className='content' >
        {isPending && <div> loading... </div>}
        {renderData.map(item => <li key={item} >{item}</li>)}
      </ul>
    </div>
  )
}

TestUseTransition.displayName = 'TestUseTransition';

export default TestUseTransition;
