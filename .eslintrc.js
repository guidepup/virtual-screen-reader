module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:require-extensions/recommended",
    "prettier",
  ],
  plugins: ["require-extensions", "@typescript-eslint"],
  rules: {
    "sort-imports": ["error", { ignoreCase: true }],
    quotes: ["error", "double"],
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    jest: "readonly",
  },
};
