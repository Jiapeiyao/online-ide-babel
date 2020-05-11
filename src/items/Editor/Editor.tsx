import React from 'react';
import MonacoEditor, {
  ChangeHandler,
  EditorDidMount,
} from 'react-monaco-editor';
import { GlobalContext } from '../Root';

interface EditorProps {
  width: number | string;
  height: number | string;
}

export default function Editor({ width, height }: EditorProps) {
  const [context, dispatch] = React.useContext(GlobalContext);
  const onChange: ChangeHandler = (newTsx, event) => {
    dispatch({
      type: 'tsx',
      tsx: newTsx,
    });
  };

  const editorDidMount: EditorDidMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });
  };

  return (
    <MonacoEditor
      width={width}
      height={height}
      value={context.tsx}
      language="typescript"
      theme="vs-dark"
      editorDidMount={editorDidMount}
      onChange={onChange}
    />
  );
}
