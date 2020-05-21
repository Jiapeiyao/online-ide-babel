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


const tsLibs = [
  'lib.dom.d.ts',
  'lib.es2015.proxy.d.ts',
  'lib.es2017.full.d.ts',
  'lib.es2018.d.ts',
  'lib.es2019.object.d.ts',
  'lib.es2020.symbol.wellknown.d.ts',
  'lib.esnext.intl.d.ts',
  'lib.dom.iterable.d.ts',
  'lib.es2015.reflect.d.ts',
  'lib.es2017.intl.d.ts',
  'lib.es2018.full.d.ts',
  'lib.es2019.string.d.ts',
  'lib.es5.d.ts',
  'lib.esnext.symbol.d.ts',
  'lib.es2015.collection.d.ts',
  'lib.es2015.symbol.d.ts',
  'lib.es2017.object.d.ts',
  'lib.es2018.intl.d.ts',
  'lib.es2019.symbol.d.ts',
  'lib.es6.d.ts',
  'lib.scripthost.d.ts',
  'lib.es2015.core.d.ts',
  'lib.es2015.symbol.wellknown.d.ts',
  'lib.es2017.sharedmemory.d.ts',
  'lib.es2018.promise.d.ts',
  'lib.es2020.bigint.d.ts',
  'lib.esnext.array.d.ts',
  'lib.webworker.d.ts',
  'lib.es2015.d.ts',
  'lib.es2016.array.include.d.ts',
  'lib.es2017.string.d.ts',
  'lib.es2018.regexp.d.ts',
  'lib.es2020.d.ts',
  'lib.esnext.asynciterable.d.ts',
  'lib.webworker.importscripts.d.ts',
  'lib.es2015.generator.d.ts',
  'lib.es2016.d.ts',
  'lib.es2017.typedarrays.d.ts',
  'lib.es2019.array.d.ts',
  'lib.es2020.full.d.ts',
  'lib.esnext.bigint.d.ts',
  'lib.es2015.iterable.d.ts',
  'lib.es2016.full.d.ts',
  'lib.es2018.asyncgenerator.d.ts',
  'lib.es2019.d.ts',
  'lib.es2020.promise.d.ts',
  'lib.esnext.d.ts',
  'lib.es2015.promise.d.ts',
  'lib.es2017.d.ts',
  'lib.es2018.asynciterable.d.ts',
  'lib.es2019.full.d.ts',
  'lib.es2020.string.d.ts',
  'lib.esnext.full.d.ts',
];

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

function declareNonTSModules(moduleNames: string[]) {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    moduleNames.map((name) => `declare module '${name}';`).join('\n'),
    'file:///decs.d.ts'
  );
}

(async () => {
  await loadLib('@types/react/index.d.ts');
  await loadLib('@types/react/global.d.ts');
  await loadLib('@types/react-dom/index.d.ts');
})().catch(console.warn);

tsLibs.forEach(async libName => {
  await loadLib(`typescript/lib/${libName}`);
});

declareNonTSModules(['antd/*', 'antd']);

export default function Editor({
  previewId = 'app',
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
    const model = monaco.editor.createModel(
      innerContent,
      'typescript',
      monaco.Uri.parse(`file:///src/${previewId}.tsx`)
    );
    editorRef.current = monaco.editor.create(divRef.current!, {
      model,
      language: 'typescript',
      theme,
    });

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
