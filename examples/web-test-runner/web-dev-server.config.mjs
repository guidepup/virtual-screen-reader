import _commonjs from "@rollup/plugin-commonjs";
import _replace from "@rollup/plugin-replace";
import { fromRollup } from "@web/dev-server-rollup";

const commonjs = fromRollup(_commonjs);
const replace = fromRollup(_replace);

export default {
  // Required to resolve node builtins.
  nodeResolve: true,
  plugins: [
    // Support `@testing-library/dom` usage of a `react-is` module that checks if
    // running in a production or development Node environment.
    // See `node_modules/@testing-library/dom/node_modules/react-is/cjs/react-is.development.js`
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    // Handle dependencies that are commonjs only and need compiling to support
    // an ESM only context.
    commonjs({
      include: [
        // `@testing-library/dom` and it's dependencies.
        "**/node_modules/@testing-library/**",
        "**/node_modules/ansi-regex/**",
        "**/node_modules/lz-string/**",
        // `aria-query` and it's dependencies.
        "**/node_modules/aria-query/**",
        "**/node_modules/dequal/**",
      ],
    }),
  ],
};
