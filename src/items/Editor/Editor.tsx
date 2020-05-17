import React from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

interface EditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  previewId?: string | number;
  width?: number | string;
  height?: number | string;
  theme?: 'vc' | 'vs-dark' | 'hc-dark';
  containerStyle?: React.CSSProperties;
}

type EditorRef = React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>;

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.React,
  allowSyntheticDefaultImports: true,
  allowUmdGlobalAccess: true,
  downlevelIteration: true,
  strict: true,
  // "skipDefaultLibCheck": true,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  target: monaco.languages.typescript.ScriptTarget.Latest,
  alwaysStrict: true,
  experimentalDecorators: true,
  esModuleInterop: true,
  resolveJsonModule: true,
});

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: false,
});


async function loadLib(filePath: string) {
  await fetch(`${filePath}`)
    .then((response) => response.text())
    .then((context) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        context,
        `file:///node_modules/${filePath}`
      );
    })
    .catch(console.warn);
}

function declareModules(moduleNames: string[]) {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    moduleNames.map(name => `declare module '${name}';`).join('\n'),
    'file:///decs.d.ts'
  );
}

(async () => {
  await loadLib('@types/react/index.d.ts');
  await loadLib('@types/react/global.d.ts');
  await loadLib('@types/react-dom/index.d.ts');
  await loadLib('@types/antd/index.d.ts');
})().catch(console.warn);


export default function Editor({
  previewId = 'preview',
  initialContent = '',
  onContentChange,
  width = '100%',
  height = '100%',
  theme = 'vs-dark',
  containerStyle = {},
}: EditorProps) {
  const divRef: React.RefObject<HTMLDivElement> = React.createRef();
  const editorRef: EditorRef = React.useRef(
    (null as unknown) as monaco.editor.IStandaloneCodeEditor
  );
  const [innerContent, setInnerContent] = React.useState(initialContent);

  React.useEffect(() => {
    const model = monaco.editor.createModel(innerContent, 'typescript', monaco.Uri.parse(`file:///src/${previewId}.tsx`));
    editorRef.current = monaco.editor.create(divRef.current!, { model, language: 'typescript', theme });

    editorRef.current.onDidChangeModelContent(
      (_: monaco.editor.IModelContentChangedEvent) => {
        onContentChange?.(editorRef.current.getValue());
        setInnerContent(editorRef.current.getValue());
      }
    );

    const resizeHandler = (_: UIEvent) => editorRef.current.layout();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      editorRef.current.dispose();
      model.dispose();
    };
  }, []);

  React.useEffect(() => {
    editorRef.current?.layout();
  }, [width, height]);

  return <div ref={divRef} style={{ ...containerStyle, width, height }} />;
}
