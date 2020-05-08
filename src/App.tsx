import React from 'react';
import Menu from './items/Menu';
import Editor from './items/Editor';
import Preview from './items/Preview';
import Root from './items/Root';
import SplitPane from 'react-split-pane';

export default function App() {
    const [width, setWidth] = React.useState('100%' as number | string);
    const [height, setHeight] = React.useState('100%' as number | string);

    React.useEffect(() => {
        const resizeHandler = (_: UIEvent) => {
            setHeight(window.innerHeight);
            setWidth('100%');
        }
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    });

    return (
        <React.Fragment>
            <Root>
                <div id='ol-ide-main'>
                    <Menu />
                    <SplitPane className='ol-ide-split-pane' split='vertical'
                        size={window.innerWidth * 0.5} onChange={setWidth}
                    >
                        <Editor width={width} height={height}/>
                        <Preview />
                    </SplitPane>
                </div>
            </Root>
        </React.Fragment>
    );
}