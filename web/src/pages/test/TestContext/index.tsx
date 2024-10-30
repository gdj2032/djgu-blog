/**
 * Context上下文
 */
import React, { useCallback, useState } from 'react';
import TestContextChild1 from './TestContextChild1';
import TestContextChild2 from './TestContextChild2';
import TestContextChild3 from './TestContextChild3';
import { ContextDemo } from './util';

function TestContext() {
  const [num, setNum] = useState(0);
  const fn = useCallback(() => {
    console.info('--- test-child --->');
  }, []);

  console.info('--- fn --->', fn.name);

  return (
    <ContextDemo.Provider value={{ setNum, num }}>
      <TestContextChild1 />
      <TestContextChild2 />
      <TestContextChild3 />
    </ContextDemo.Provider>
  );
}

TestContext.displayName = 'TestContext';

export default TestContext;
