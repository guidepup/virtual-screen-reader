module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["coverage", "examples", "lib"],
  rules: {
    "sort-imports": ["error", { ignoreCase: true }],
    quotes: ["error", "double", { avoidEscape: true }],
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    jest: "readonly",
  },
};
