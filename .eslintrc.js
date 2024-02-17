module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:require-extensions/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "require-extensions"],
  rules: { "sort-imports": ["error", { ignoreCase: true }] },
};
