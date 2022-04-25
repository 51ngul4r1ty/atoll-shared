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
            statements: 50.39,
            branches: 26.46,
            functions: 23.3,
            lines: 47.82
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
