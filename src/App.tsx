import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './items/Menu';
import Editor from './items/Editor';
import Preview from './items/Preview';
import { GlobalContext } from './items/Root';
import SplitPane from 'react-split-pane';
import compile from './utils/compile';

export default function App() {
  const [width, setWidth] = React.useState('100%' as number | string);
  const [height, setHeight] = React.useState('100%' as number | string);
  const [context, dispatch] = React.useContext(GlobalContext);

  const onContentChange = (content: string) => {
    console.log(dispatch);
    dispatch({ type: 'tsx', tsx: content });
  };

  React.useEffect(() => {
    const resizeHandler = (_: UIEvent) => {
      setHeight(window.innerHeight - 2.5 * 16);
      setWidth('100%');
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  });

  React.useEffect(() => {
    const container = document.getElementById('preview');
    if (!container) {
      throw Error('Element with id `preview` not found');
    }
    const node = document.createElement('SCRIPT');
    try {
      const code = compile(context.tsx);
      ReactDOM.unmountComponentAtNode(container);
      node.innerHTML = code;
    } catch (err) {
      ReactDOM.unmountComponentAtNode(container);
      container.innerText = err;
    }
    document.body.appendChild(node);
    
    return () => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(node);
    };
  }, [context.tsx]);

  return (
    <div id="ol-ide-main">
      <Menu />
      <SplitPane
        split="vertical"
        defaultSize={window.innerWidth * 0.5}
        onChange={setWidth}
        style={{ position: 'relative' }}
      >
        <Editor
          initialContent={context.tsx}
          width={width} height={height}
          onContentChange={onContentChange}
        />
        <Preview />
      </SplitPane>
    </div>
  );
}
