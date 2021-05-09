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
            statements: 46.45,
            branches: 23.35,
            functions: 20.85,
            lines: 47.95
        }
    },
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
    globals: {
        "ts-jest": {
            diagnostics: true
        }
    }
};
