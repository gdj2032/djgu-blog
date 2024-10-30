/**
 * flex布局
 */
import React from 'react';
import './index.scss';
import FlexStart from './FlexStart';
import FlexSpaceBetween from './FlexSpaceBetween';

function TestFlex() {
  return (
    <div className='TestFlex'>
      <FlexStart />
      <FlexSpaceBetween />
    </div>
  );
}

TestFlex.displayName = 'TestFlex';

export default TestFlex;
