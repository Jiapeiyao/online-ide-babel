import React from 'react';

interface PreviewProps {
  previewRef?: React.RefObject<HTMLDivElement>;
}

export default function Preview({ previewRef }: PreviewProps) {
  return <div id="app" ref={previewRef}></div>;
}
