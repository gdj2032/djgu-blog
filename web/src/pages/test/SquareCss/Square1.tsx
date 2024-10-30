/**
 * 正常设置宽高
 */
import React from 'react';
import './index.scss';

function Square1() {
  return (
    <div className='square'>
      <h2>1.正常设置宽高 ~ 100px * 100px</h2>
      <div className='square-1'></div>
    </div>
  );
}

Square1.displayName = 'Square1';

export default Square1;
