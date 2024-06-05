module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "google",
    "react-app",
    "react-app/jest",
  ],
  rules: {
    "no-restricted-globals": "off",
    "prefer-arrow-callback": "off",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "max-len": "off",
    "indent": "off",
    "linebreak-style": "off",
    "no-unused-vars": "warn", // Ostrzeżenie zamiast błędu dla nieużywanych zmiennych
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
