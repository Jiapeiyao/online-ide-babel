import types from '@babel/types';

/**
 * import { Button, Input as In2 } from 'antd';
 * 
 * // tansfer to 
 * 
 * var Button = antd.Button,
 *     In = antd.Input;
 */
export function importUmd({ types: t }: { types: typeof types }) {
  return {
    visitor: {
      ImportDeclaration: (path: any, state: any) => {
        path.replaceWith(t.variableDeclaration(
          'const',
          path.node.specifiers.map((specifier: types.ImportSpecifier) =>
            t.variableDeclarator(
              specifier.local,
              t.memberExpression(
                t.identifier(path.node.source.value),
                specifier.imported
              )
            )
          )
        ));
      },
    },
  };
}