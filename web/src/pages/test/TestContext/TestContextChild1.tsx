import React from 'react';
import { ContextDemo } from './util';

interface IProps {}

function TestContextChild1(props: IProps) {
  return (
    <ContextDemo.Consumer>
      {/*
          直接使用Consumer
          这种方式获取参数
          但是这种方式 不方便在render意外的地方使用传下来的参数
        */}
      {context => (
        <div>
          <div>函数组件 子孙组件TestContextChild1 ~ ContextDemo.Consumer</div>
          <div>传下来的{context.num}</div>
          <button onClick={() => context.setNum(Math.random() * 10)}>设置随机数</button>
        </div>
      )}
    </ContextDemo.Consumer>
  );
}

TestContextChild1.displayName = 'TestContextChild1';

export default TestContextChild1;
