import { transform, registerPlugin } from '@babel/standalone';
import { importUmd } from './transform-import-umd-object';

registerPlugin('transform-import-umd-object', importUmd);

export function compile(tsx: string) {
    return transform(tsx, {
        filename: 'entry.tsx',
        presets: ['env', 'react', 'typescript'],
        plugins: [
            'proposal-object-rest-spread',
            'proposal-class-properties',
            'transform-runtime',
            'transform-import-umd-object'
        ],
    }).code;
}