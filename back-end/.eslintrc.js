module.exports = {
  "env": {
    "commonjs": true,
    "es2021": true,
    "node": true,
    "commonjs": true,
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    "default-case": "warn",
    "default-case-last": "warn",
    "no-implicit-coercion": "warn",
    "no-implied-eval": "error",
    "@typescript-eslint/no-non-null-assertion": "off"
  }
};
