const createStore = (reducer, state = {}) => {
  const listeners = new Set();
  return {
    getState: () => state as any,
    dispatch: action => {
      const preState = state;
      state = reducer(state, action);
      listeners.forEach((listener: any) => listener(preState, state));
    },
    subscribe: listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

const compose = fns => fns.reduce((a, b) => args => a(b(args)));

// 中间件
const applyMiddleware = (store, middlewares) => {
  //  执行一次注入 store
  const fns = middlewares.map(middleware => middleware(store));

  // 使用 compose 组合后，赋值修改真正的 dispatch
  store.dispatch = compose(fns)(store.dispatch);
};

// // reducers.js
export function counterReducer(state, action) {
  console.info('--- counterReducer --->', { state, action });
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
}

const testStore = createStore(counterReducer, { counter: 0 });

export { testStore };
