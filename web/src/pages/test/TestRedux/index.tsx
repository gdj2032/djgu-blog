/**
 * 手写简易redux
 */
import React, { useEffect, useReducer } from 'react';
import { testStore } from './util';

function TestRedux() {
  const [state, dispatch] = useReducer((state, action) => ({ ...state, ...testStore.getState() }), { counter: 0 });
  console.info('--- state --->', state, testStore.getState());
  useEffect(() => {
    console.info('--- testStore state --->', testStore.getState());
  }, [testStore.getState()]);
  return (
    <div className='TestRedux'>
      <p>Counter: {testStore.getState().counter}</p>
      <button onClick={() => testStore.dispatch({ type: 'INCREMENT' })}>Increment</button>
      <button onClick={() => testStore.dispatch({ type: 'DECREMENT' })}>Decrement</button>
    </div>
  );
}

TestRedux.displayName = 'TestRedux';

export default TestRedux;
