import { transform, registerPlugin } from '@babel/standalone';
import { importUmd } from './transform-import-umd-object';

registerPlugin('transform-import-umd-object', importUmd);

export default function compile(tsx: string) {
  const compiledCode = transform(tsx, {
    filename: 'entry.tsx',
    presets: ['env', 'react', 'typescript'],
    plugins: [
      'proposal-object-rest-spread',
      'proposal-class-properties',
      'transform-import-umd-object'
    ],
  }).code;

  console.log(compiledCode);

  return `(function () {${compiledCode}})();`
}