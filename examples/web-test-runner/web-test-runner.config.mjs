import path from "path";
import { fileURLToPath } from "url";
import _alias from "@rollup/plugin-alias";
import _commonjs from "@rollup/plugin-commonjs";
import _nodePolyfills from "rollup-plugin-node-polyfills";
import _nodeResolve from "@rollup/plugin-node-resolve";
import _replace from "@rollup/plugin-replace";
import { fromRollup } from "@web/dev-server-rollup";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const alias = fromRollup(_alias);
const commonjs = fromRollup(_commonjs);
const nodePolyfills = fromRollup(_nodePolyfills);
const nodeResolve = fromRollup(_nodeResolve);
const replace = fromRollup(_replace);

export default {
  nodeResolve: true,
  plugins: [
    alias({
      entries: [
        {
          find: "aria-query",
          replacement: path.resolve(
            __dirname,
            "node_modules/aria-query-esm/lib/esm/index.js"
          ),
        },
      ],
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    nodePolyfills(),
    nodeResolve({ preferBuiltins: false }),
    commonjs({
      include: [
        "**/node_modules/@testing-library/**",
        "**/node_modules/lz-string/**",
        "**/node_modules/ansi-regex/**",
      ],
    }),
  ],
};
