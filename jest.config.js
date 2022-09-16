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
            statements: 51.05,
            branches: 27.58,
            functions: 25.67,
            lines: 48.72
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
