import { transform, registerPlugin } from '@babel/standalone';
import transferUmd from './transform-umd';

registerPlugin('transform-umd', transferUmd);

export default function compile(tsx: string) {
  const compiledCode = transform(tsx, {
    filename: 'entry.tsx',
    presets: ['env', 'react', 'typescript'],
    plugins: [
      'proposal-object-rest-spread',
      'proposal-class-properties',
      [
        'transform-umd',
        {
          externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            antd: 'antd',
          },
        },
      ],
    ],
  }).code;

  console.log(compiledCode);

  return `(function () {${compiledCode}})();`;
}
