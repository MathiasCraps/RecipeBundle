module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "jest/globals": true
    },
    "settings": {
        "react": {
            "version": "detect",
            "flowVersion": "0.53"
        },
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "jest"
    ],
    "rules": {
        "default-case": "warn",
        "default-case-last": "warn",
        "no-implicit-coercion": "warn",
        "no-implied-eval": "error",
        "@typescript-eslint/no-non-null-assertion": "off"
    }
};
