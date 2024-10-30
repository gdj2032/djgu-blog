/**
 * 3.百分比+padding
 */
import React from 'react';
import './index.scss';

function Square3() {
  return (
    <div className='square'>
      <h2>3.百分比+padding ~ 10%</h2>
      <div className='square-3'>
        <div className='content'>正常内容</div>
      </div>
    </div>
  );
}

Square3.displayName = 'Square3';

export default Square3;
