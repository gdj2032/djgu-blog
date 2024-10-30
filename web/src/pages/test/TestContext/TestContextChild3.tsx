import React, { Component } from 'react';
import { ContextDemo } from './util';

export default class TestContextChild3 extends Component {
  // static contextType?: React.Context<IContextDemo> = ContextDemo;
  static contextType = ContextDemo;

  render() {
    return (
      <div>
        <div>类组件 子孙组件TestContextChild3 ~ contextType</div>
        <div>传下来的{this.context.num}</div>
        <button onClick={() => this.context.setNum(Math.random() * 10)}>设置随机数</button>
      </div>
    );
  }
}
