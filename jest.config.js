module.exports = {
    roots: ["<rootDir>/src"],
    testMatch: ["<rootDir>/src/**/*.(spec|test).{js,jsx,mjs,ts,tsx}"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform"
    },
    coverageReporters: ["lcov", "text-summary"],
    coverageThreshold: {
        global: {
            statements: 50.36,
            branches: 27.51,
            functions: 24.64,
            lines: 47.91
        }
    },
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
    globals: {
        "ts-jest": {
            diagnostics: true,
            tsconfig: "tsconfig.test.json"
        }
    }
};
