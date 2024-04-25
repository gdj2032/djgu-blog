import { Button } from 'antd';
import React, { memo, useState } from 'react';

interface IProps {
  fn: () => void;
}

const TestChild = memo((props: IProps) => {
  const { fn } = props;
  console.info('--- test child memo --->');

  const [n, setN] = useState(0)

  const handleAdd = () => {
    setN(n + 1);
    setTimeout(() => {
      setN((c) => c + 1);
    }, 0);
  }

  return (
    <div className='TestChild'>
      <h2>TestChild</h2>
      <Button onClick={fn}>TestChild</Button>
      <Button onClick={handleAdd}>TestChildAdd</Button>
      <div>TestChild-value: {n}</div>
      <div>-----------------------</div>
    </div>
  )
})

TestChild.displayName = 'TestChild';

export default TestChild;
