import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './items/Menu';
import Editor from './items/Editor';
import Preview from './items/Preview';
import { GlobalContext } from './items/Root';
import SplitPane from 'react-split-pane';
import compile from './utils/compile';
import { Alert } from 'antd';

export default function App() {
  const [width, setWidth] = React.useState('100%' as number | string);
  const [height, setHeight] = React.useState('100%' as number | string);
  const [context, dispatch] = React.useContext(GlobalContext);
  const previewRef: React.RefObject<HTMLDivElement>  = React.createRef();

  const onContentChange = (content: string) => {
    dispatch({ type: 'tsx', tsx: content });
  };

  React.useEffect(() => {
    const previewContainer = document.getElementById('app');
    if (!previewContainer) {
      console.warn('Element with id `app` not found');
      return;
    }
    try {
      const code = compile(context.tsx);
      window.onerror = event => {
        ReactDOM.render(
          <Alert message={'Error'} description={typeof event === 'string' ? event : event.toString()} type="error" />,
          previewContainer
        );
      } 
      eval(code);
      return () => {
        window.onerror = null;
      };
    } catch (err) {
      ReactDOM.render(
        <Alert message={'Error'} description={err.toString()} type="error" />,
        previewContainer
      );
    }
  }, [context.tsx]);

  return (
    <div id="ol-ide-main">
      <Menu />
      <SplitPane
        split="vertical"
        defaultSize={'50%'}
        onChange={setWidth}
        style={{ position: 'relative', width: '100%', minWidth: '80rem' }}
      >
        <Editor
          initialContent={context.tsx}
          width={width} height={height}
          onContentChange={onContentChange}
        />
        <Preview ref={previewRef}/>
      </SplitPane>
    </div>
  );
}
