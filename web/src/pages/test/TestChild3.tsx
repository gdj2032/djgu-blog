import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import useInterval from './useInterval';
import useTimeout from './useTimeout';

interface IProps {
}

function TestChild3(props: IProps) {
  const [count, setCount] = useState(0)

  // useTimeout(() => {
  //   console.log('useTimeout > count', count);
  // }, { deps: [count] })

  // useInterval(() => {
  //   console.log('useInterval > count', count);
  // }, { deps: [count], delay: 5000 })

  return (
    <div className='TestChild3'>
      <div>-----------TestChild3------------</div>
      <Button onClick={() => { setCount(count + 1) }}>加</Button>
      <div>{count}</div>
    </div>
  )
}

TestChild3.displayName = 'TestChild3';

export default TestChild3;
