import React from 'react';
import { compile } from '../../utils/compile';


interface ContextState {
    tsx: string;
    hash: string;
}

type Action = Partial<ContextState> & {
    type: string;
};

type Dispatch = React.Dispatch<Action>;

const contextReducer: React.Reducer<ContextState, Action> = (preState: ContextState, action: Action) => {
    switch (action.type) {
        case 'tsx': {
            return { ...preState, tsx: action.tsx || '' };
        }
        default: {
            return preState;
        }
    }
}

const defaultState: ContextState = {
    // tslint:disable-next-line: quotemark
    tsx: [
        `import { Button, Input as In } from 'antd';`,
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
        `console.log('The World');`,
    ].join('\n'),
    hash: '',
}

const defaultContext: [ContextState, Dispatch] = [defaultState, (_: Action) => {}];

const GlobalContext = React.createContext(defaultContext);

export default function Root({ children }: { children: React.ReactNode }) {
    const [context, dispatch] = React.useReducer(contextReducer, defaultState);

    React.useEffect(() => {
        try {
            const code = compile(context.tsx);
    
            const newNode = document.createElement('SCRIPT');
            console.log(code);
            newNode.innerHTML = code || '';
            document.body.appendChild(newNode);
    
            return () => {
                document.body.removeChild(newNode);
            };
        } catch (err) {
            console.warn(err);
        }

    }, [context.tsx]);

    return (
        <GlobalContext.Provider value={[context, dispatch]}>
            {children}
        </GlobalContext.Provider>
    );
}

export {
    GlobalContext
};