module.exports = {
    roots: ["<rootDir>/src"],
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs,ts,tsx}",
        "<rootDir>/src/__tests__/**/*.{js,jsx,mjs,ts,tsx}",
        "<rootDir>/src/**/*.(spec|test).{js,jsx,mjs,ts,tsx}"
    ],
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
