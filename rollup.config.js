import resolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import autoprefixer from "autoprefixer";
import jsx from "rollup-plugin-jsx";
import image from "rollup-plugin-image";
import json from "rollup-plugin-json";

import pkg from "./package.json";

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: "inline"
        },
        {
            file: pkg.module,
            format: "es",
            sourcemap: "inline"
        }
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
        resolve({
            browser: true,
            dedupe: ["react", "react-dom"],
            customResolveOptions: {
                moduleDirectory: "node_modules"
            },
            preferBuiltins: true
        }),
        postcss({
            extract: true,
            plugins: [autoprefixer()],
            writeDefinitions: false
        }),
        typescript({
            typescript: require("typescript"),
            tsconfig: "tsconfig.json",
            objectHashIgnoreUnknownHack: false
        }),
        json({
            compact: true
        }),
        jsx({ factory: "React.createElement" }),
        image()
    ]
};
