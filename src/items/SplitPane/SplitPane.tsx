import React from 'react';

interface SplitPaneProps {
    splitType: 'vertical' | 'horizontal';

}

export default function SplitPane() {
    return <div></div>
}

function VerticalSplitPane() {
    return <div>
        <div></div>
        <div></div>
        <div></div>
    </div>;
}

function HorzontalSplitPane() {
    return <div>
        <div></div>
        <div></div>
        <div></div>
    </div>;
}