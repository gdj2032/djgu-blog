import { createContext } from 'react';

export const ContextDemo = createContext({
  setNum: (num: number) => undefined,
  num: 0
});
