import _commonjs from "@rollup/plugin-commonjs";
import _replace from "@rollup/plugin-replace";
import { fromRollup } from "@web/dev-server-rollup";

const commonjs = fromRollup(_commonjs);
const replace = fromRollup(_replace);

export default {
  nodeResolve: true,
  plugins: [
    // Support @testing-library/dom usage of module that checks if running in
    // production or development.
    // See `node_modules/@testing-library/dom/node_modules/react-is/cjs/react-is.development.js`
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    // Handle dependencies that are commonjs only and need compiling to support
    // an ESM environment.
    commonjs({
      include: [
        "**/node_modules/@testing-library/**",
        "**/node_modules/ansi-regex/**",
        "**/node_modules/aria-query/**",
        "**/node_modules/dequal/**",
        "**/node_modules/lz-string/**",
      ],
    }),
  ],
};
