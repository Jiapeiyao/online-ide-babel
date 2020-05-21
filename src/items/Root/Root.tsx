import React from 'react';

interface ContextState {
  tsx: string;
  hash: string;
}

type Action = Partial<ContextState> & {
  type: string;
};

type Dispatch = React.Dispatch<Action>;

const contextReducer: React.Reducer<ContextState, Action> = (
  preState: ContextState,
  action: Action
) => {
  switch (action.type) {
    case 'tsx': {
      return { ...preState, tsx: action.tsx || '' };
    }
    default: {
      return preState;
    }
  }
};

const defaultState: ContextState = {
  // tslint:disable-next-line: quotemark
  tsx: [
    `import React from 'react';`,
    'import ReactDOM from \'react-dom\';',
    `import { Input as In } from 'antd';`,
    `import Button from 'antd/Button';`,
    ``,
    `function App() {`,
    `  return <>`,
    `    <Button>Hello World</Button>`,
    `    <In></In>`,
    `  </>`,
    `};`,
    ``,
    `ReactDOM.render(`,
    `  <App />,`,
    `  document.getElementById('app')`,
    `);`,
    ``,
    `console.log('The World!');`,
  ].join('\n'),
  hash: '',
};

const defaultContext: [ContextState, Dispatch] = [
  defaultState,
  (_: Action) => console.error('`dispatch` can only be used in the context provider\'s children.'),
];

const GlobalContext = React.createContext(defaultContext);

export default function Root({ children }: { children: React.ReactNode }) {
  const [context, dispatch] = React.useReducer(contextReducer, defaultState);

  return (
    <GlobalContext.Provider value={[context, dispatch]}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext };
