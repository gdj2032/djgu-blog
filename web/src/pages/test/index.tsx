import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import TestChild from './TestChild';
import TestChild2 from './TestChild2';
import TestChild3 from './TestChild3';
import TestUseTransition from './TestUseTransition';
import TestUseDeferredValue from './TestUseDeferredValue';

function Test() {
  const [num, setNum] = useState(0)
  const fn = useCallback(() => {
    console.info('--- test-child --->');
  }, [])

  console.info('--- fn --->', fn.name);
  return (
    <div className='Test'>

      {/* <Button onClick={() => setNum(num + 1)}>add</Button>
      <div>num: {num}</div>

      <TestChild fn={fn} />

      <TestChild2 />

      <TestChild3 /> */}
      {/* <TestUseTransition /> */}
      <TestUseDeferredValue />
    </div>
  )
}

Test.displayName = 'Test';

export default Test;
