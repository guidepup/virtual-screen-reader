const eslint = require("@eslint/js");
const typescriptEslint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");
const globals = require("globals");

module.exports = typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        jest: "readonly",
      },
      parser: typescriptEslint.parser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.test.json"],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "sort-imports": ["error", { ignoreCase: true }],
      quotes: ["error", "double", { avoidEscape: true }],
    },
  },
  {
    ignores: [
      ".github",
      ".vscode",
      "coverage",
      "docs",
      "examples",
      "node_modules",
      "lib",
      "test/wpt",
      "test/wpt-jsdom",
      "eslint.config.js",
      "jest.config.js",
      "tsup.config.ts",
    ],
  }
);
