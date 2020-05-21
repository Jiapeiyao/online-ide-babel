import React from 'react';

interface PreviewProps {
  ref?: React.RefObject<HTMLDivElement>;
}

export default function Preview({ ref }: PreviewProps) {
  return <div id="app" ref={ref}></div>;
}
