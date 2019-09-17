import postcss from 'rollup-plugin-postcss-modules';
import typescript from 'rollup-plugin-typescript2';
import autoprefixer from 'autoprefixer';
import jsx from 'rollup-plugin-jsx';
import image from 'rollup-plugin-image';
import json from 'rollup-plugin-json';

import pkg from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ], plugins: [
        postcss({
            extract: true,
            plugins: [autoprefixer()],
            writeDefinitions: false
        }),
        typescript({
            typescript: require('typescript'),
            tsconfig: 'tsconfig.json',
            objectHashIgnoreUnknownHack: true
        }),
        json({
            compact: true
        }),
        jsx({ factory: 'React.createElement' }),
        image()
    ],
}
