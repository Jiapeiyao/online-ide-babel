import types from '@babel/types';

const externals: Record<string, string> = {
  react: 'React',
  'react-dom': 'ReactDOM',
  antd: 'antd',
}

interface Path {
  node: types.ImportDeclaration;
  replaceWith: (exp: types.Node) => void;
  remove: () => void;
}


/**
 * import * as React from 'react'; // already assigned by UMD
 * import ReactDOM from 'react-dom'; // already assigned by UMD
 * import { Button, Input as In } from 'antd';
 * import Drawer from 'antd/Drawer';
 * 
 * >>>>>> tansfer to >>>>>>>
 * 
 * var Button = antd.Button,
 *     In = antd.Input;
 * var Drawer = antd.Drawer;
 */

export function importUmd({ types: t }: { types: typeof types }) {
  return {
    visitor: {
      ImportDeclaration: (path: Path, state: any) => {
        const variableDeclarators = getVariableDeclarators(path, t);
        if (variableDeclarators.length === 0) {
          path.remove();
        } else {
          path.replaceWith(t.variableDeclaration(
            'const',
            variableDeclarators
          ));
        }
      }
    },
  };
}

function getVariableDeclarators(path: Path, t: typeof types): types.VariableDeclarator[] {
  const variableDeclarators: types.VariableDeclarator[] = [];
  path.node.specifiers.forEach((specifier: types.ImportDeclaration['specifiers'][0]) => {
    if (t.isImportDefaultSpecifier(specifier) || t.isImportNamespaceSpecifier(specifier)) {
      if (isExpectedImport(specifier.local.name, path.node.source.value)) {
        variableDeclarators.push(t.variableDeclarator(
          specifier.local,
          transferSourcePath(path.node.source.value, t),
        ));
      }
    } else {
      variableDeclarators.push(t.variableDeclarator(
        specifier.local,
        t.memberExpression(
          transferSourcePath(path.node.source.value, t),
          specifier.imported
        )
      ));
    }
  });
  return variableDeclarators;
}

function getExternalAlias(libName: string) {
  return externals[libName] ?? libName;
}

type SourcePathExpression = types.Identifier | types.MemberExpression

function transferSourcePath(sourcePath: string, t: typeof types): SourcePathExpression {
  const [libName, ...properties] = sourcePath.split('/');
  const expression: types.Identifier = t.identifier(getExternalAlias(libName));
  return properties.reduce<SourcePathExpression>(
    (object: SourcePathExpression, property: string) => t.memberExpression(object, t.stringLiteral(property), true),
    expression,
  );
}

function isExpectedImport(local: string, sourcePath: string) {
  const isUmdExternal = externals[sourcePath] === local;
  const isRelativeModule = sourcePath.startsWith('.');
  return !(isUmdExternal || isRelativeModule);
}