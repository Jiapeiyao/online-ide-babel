import React from 'react';
import { GlobalContext } from '../Root';
// import Babel from '@babel/standalone';


export default function Menu() {
    const [context, dispatch] = React.useContext(GlobalContext);
    const [node, setNode] = React.useState(null as unknown as HTMLElement);

    const run = () => {
        
        // const newNode = document.createElement('SCRIPT');
        // newNode.setAttribute('type', 'text/babel');
        // newNode.setAttribute('data-presets', 'env,react,typescript');
        // newNode.setAttribute('data-plugins', 'proposal-object-rest-spread,proposal-class-properties,transform-runtime');
        // newNode.innerHTML = context.tsx;
        // document.body.appendChild(document.querySelector('#babel')!);
        // document.body.appendChild(newNode);

        
        
        // setNode(newNode);

    };

    React.useEffect(() => {
        run();
    }, []);

    React.useEffect(() => {
        return () => {
            if (node !== null) {
                document.body.removeChild(node);
            }
        }
    }, [node]);

    return <div id='ol-ide-menu'>
        <MenuButton text={'Run'} onClick={run} />
    </div>
}

interface MenuButtonProps {
    text: string;
    onClick: () => void;
}

function MenuButton({ text, onClick }: MenuButtonProps) {
    return <button className='ol-ide-menu-button' onClick={onClick}>{text}</button>
}