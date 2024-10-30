import React, { useContext } from 'react';
import { ContextDemo } from './util';

function TestContextChild2() {
  const context = useContext(ContextDemo);
  return (
    <div className='TestContextChild2'>
      <div>函数组件 子孙组件TestContextChild2 ~ useContext</div>
      <div>传下来的{context.num}</div>
      <button onClick={() => context.setNum(Math.random() * 10)}>设置随机数</button>
    </div>
  );
}

TestContextChild2.displayName = 'TestContextChild2';
TestContextChild2.contextType = ContextDemo;

export default TestContextChild2;
