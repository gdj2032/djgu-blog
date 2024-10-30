import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import TestUseTransition from './TestUseTransition';
import TestUseDeferredValue from './TestUseDeferredValue';
import TestContext from './TestContext';
import TestFlex from './TestFlex';
import TestRedux from './TestRedux';
import SquareCss from './SquareCss';

function Test() {
  const [num, setNum] = useState(0);
  const fn = useCallback(() => {
    console.info('--- test-child --->');
  }, []);

  console.info('--- fn --->', fn.name);

  return (
    <div className='Test'>
      {/* Context上下文 */}
      {/* <TestContext /> */}

      {/* hooks 过度任务 */}
      {/* <TestUseTransition /> */}
      {/* <TestUseDeferredValue /> */}

      {/* flex布局 */}
      {/* <TestFlex /> */}

      {/* 手写简易redux */}
      <TestRedux />

      {/* 仅使用 CSS 怎么实现宽高自适应的正方形？ */}
      {/* <SquareCss /> */}
    </div>
  );
}

Test.displayName = 'Test';

export default Test;
