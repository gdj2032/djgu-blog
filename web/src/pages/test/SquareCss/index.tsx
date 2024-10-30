/**
 * 仅使用 CSS 怎么实现宽高自适应的正方形？
 */
import React from 'react';
import './index.scss';
import Square1 from './Square1';
import Square2 from './Square2';
import Square3 from './Square3';
import Square4 from './Square4';

function SquareCss() {
  return (
    <div className='square-css'>
      <div className='square-sticky'>粘性.....</div>
      <h1>仅使用 CSS 怎么实现宽高自适应的正方形？</h1>
      <Square1 />
      <Square2 />
      <Square3 />
      <Square4 />
    </div>
  );
}

SquareCss.displayName = 'SquareCss';

export default SquareCss;
