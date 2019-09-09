const fs = require("fs");
const path = require("path");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const srcShared = resolveApp("src");

module.exports = {
    plugins: [
        require("postcss-import")({
            path: [srcShared, `${__dirname}/node_modules`],
        }),
        require("postcss-nested")(),
        require("postcss-flexbugs-fixes")(),
        require("autoprefixer")(),
        require("postcss-custom-properties")(),
        require("postcss-assets")({
            basePath: "./assets",
        }),
        // This is broken.
        // require("postcss-normalize")(),
    ],
    sourceMap: true
};
