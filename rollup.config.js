import postcss from 'rollup-plugin-postcss-modules';
import typescript from 'rollup-plugin-typescript2';
import autoprefixer from 'autoprefixer';
import jsx from 'rollup-plugin-jsx';
// import postcss from 'rollup-plugin-postcss';
// import css from "@modular-css/rollup";
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
        // import postcss from 'rollup-plugin-postcss';
        // postcss({
        //     include: '*.module.css',
        //     modules: true,
        //     // Or with custom options for `postcss-modules`
        //     modules: {}
        // }),
        postcss({
            extract: true,
            plugins: [autoprefixer()],
            writeDefinitions: true
        }),
        typescript({
            typescript: require('typescript'),
            tsconfig: 'tsconfig.json',
            objectHashIgnoreUnknownHack: true
        }),
        json({
            compact: true
        }),
        // css(),
        jsx({ factory: 'React.createElement' }),
        image()
    ],
}
