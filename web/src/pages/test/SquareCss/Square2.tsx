/**
 * 2.使用rem、vw等相对单位
 */
import React from 'react';
import './index.scss';

function Square2() {
  return (
    <div className='square'>
      <h2>2.使用rem、vw等相对单位</h2>
      <h3>2.1 rem ~ 10rem * 10rem</h3>
      <div className='square-2-1'></div>
      <p>屏幕宽度大于1200px时，rem的盒子的大小为 160px * 160px；</p>
      <p>屏幕宽度小于1200px时，rem的盒子的大小为 120px * 120px；</p>

      <h3>2.2 vw ~ 10vw * 10vw</h3>
      <div className='square-2-2'></div>
    </div>
  );
}

Square2.displayName = 'Square2';

export default Square2;
