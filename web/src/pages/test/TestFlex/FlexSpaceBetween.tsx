/**
 * 居中对齐
 */
import React from 'react';
import './index.scss';
import { BOOK_BG_COLOR } from '@/constants';

function FlexSpaceBetween() {
  const arr = Array.from(Array(10).keys());
  const arr2 = Array.from(Array(4).keys());
  return (
    <>
      <h1>FlexSpaceBetween</h1>
      <div>末尾补足4个元素</div>
      <div className='flex-space-between1'>
        {arr.map((item, idx) => (
          <div key={item} className='flex-space-between1-item' style={{ background: BOOK_BG_COLOR.colors[idx] }}>
            {item}
          </div>
        ))}
        {arr2.map(item => (
          <div key={item} className='flex-space-between1-item2'></div>
        ))}
      </div>
      <div>计算last-child:nth-child margin-right属性</div>
      <div className='flex-space-between2'>
        {arr.map((item, idx) => (
          <div key={item} className='flex-space-between2-item' style={{ background: BOOK_BG_COLOR.colors[idx] }}>
            {item}
          </div>
        ))}
      </div>
    </>
  );
}

FlexSpaceBetween.displayName = 'FlexSpaceBetween';

export default FlexSpaceBetween;
