module.exports = {
    roots: ["<rootDir>/src"],
    testRegex: "(/__tests__/.*|(\\.|/)(test))\\.ts$",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform"
    },
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
    globals: {
        "ts-jest": {
            diagnostics: true
        }
    }
};
