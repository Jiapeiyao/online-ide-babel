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
      console.log(action.tsx);
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
    `import { Input as In } from 'antd';`,
    `import Button from 'antd/Button';`,
    ``,
    `const Dr = antd.Drawer;`,
    ``,
    `function UserCode() {`,
    `  return <>`,
    `    <Button>Hello World</Button>`,
    `    <In></In>`,
    `  </>`,
    `};`,
    ``,
    `ReactDOM.render(`,
    `  <UserCode />,`,
    `  document.getElementById('preview')`,
    `);`,
    ``,
    `console.log('The World!');`,
  ].join('\n'),
  hash: '',
};

const defaultContext: [ContextState, Dispatch] = [
  defaultState,
  (_: Action) => console.warn('Dispatch function of Root Context has not been initialized.'),
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
