import React, { useEffect } from 'react';
// import MonacoEditor, {
//   ChangeHandler,
//   EditorDidMount,
// } from 'react-monaco-editor';
import { GlobalContext } from '../Root';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

interface EditorProps {
  width: number | string;
  height: number | string;
}

// export default function Editor({ width, height }: EditorProps) {
//   const [context, dispatch] = React.useContext(GlobalContext);
//   const onChange: ChangeHandler = (newTsx, event) => {
//     dispatch({
//       type: 'tsx',
//       tsx: newTsx,
//     });
//   };

//   const editorDidMount: EditorDidMount = (editor, monaco) => {
//     monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//       jsx: monaco.languages.typescript.JsxEmit.React,
//     });

//     monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//       noSemanticValidation: false,
//       noSyntaxValidation: false,
//       noSuggestionDiagnostics: false,
//     });
//   };

//   return (
//     <MonacoEditor
//       width={width}
//       height={height}
//       value={context.tsx}
//       language="typescript"
//       theme="vs-dark"
//       editorDidMount={editorDidMount}
//       onChange={onChange}
//     />
//   );
// }

type EditorRef = React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;

// monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//   jsx: monaco.languages.typescript.JsxEmit.React,
// });

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: false,
});

export default function Editor({ width = '100%', height = '100%' }: EditorProps) {
  const divRef: React.RefObject<HTMLDivElement> = React.createRef();
  const editorRef: EditorRef = React.useRef(null);
  const [context, dispatch] = React.useContext(GlobalContext);

  React.useEffect(() => {
    editorRef.current = monaco.editor.create(divRef.current!, {
      value: context.tsx,
      language: 'typescript',
      theme: 'vs-dark',
    });

    editorRef.current.onDidChangeModelContent(
      (e: monaco.editor.IModelContentChangedEvent) => {
        dispatch({ type: 'tsx', tsx: editorRef.current!.getValue() });
      }
    );

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  React.useEffect(() => {
    editorRef.current?.layout();
  }, [width, height])

  return <div ref={divRef} style={{ width, height }} />;
}