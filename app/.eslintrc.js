module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "react-app",
    "react-app/jest",
    "airbnb",
    "airbnb-typescript",
    "plugin:react/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "tsconfig.eslint.json",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    // "react/display-name": "off",
    "default-param-last": "off",
    camelcase: ["error", { properties: "never", ignoreDestructuring: true }],
    "import/prefer-default-export": "off",
    "react/jsx-uses-react": "off", // allow no import * as React from "react"
    "react/react-in-jsx-scope": "off", // allow no import * as React from "react"
    "react/jsx-props-no-spreading": "off",
    "react/jsx-filename-extension": [1, { extensions: ["js.", "jsx", ".ts", ".tsx"] }],

    "@typescript-eslint/default-param-last": "off",
  },
};
