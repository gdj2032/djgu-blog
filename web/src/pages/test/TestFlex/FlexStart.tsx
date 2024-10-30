/**
 * 左对齐
 */
import React from 'react';
import './index.scss';
import { BOOK_BG_COLOR } from '@/constants';

function FlexStart() {
  const arr = Array.from(Array(10).keys());
  return (
    <>
      <h1>FlexStart</h1>
      <div className='flex-start'>
        {arr.map((item, idx) => (
          <div key={item} className='flex-start-item' style={{ background: BOOK_BG_COLOR.colors[idx] }}>
            {item}
          </div>
        ))}
      </div>
    </>
  );
}

FlexStart.displayName = 'FlexStart';

export default FlexStart;
