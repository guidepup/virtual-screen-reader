import { defineConfig, Options } from "tsup";
import { dependencies } from "./package.json";

export default defineConfig((options) => {
  const commonOptions: Partial<Options> = {
    entry: {
      index: "src/index.ts",
    },
    sourcemap: true,
    ...options,
  };

  return [
    // Modern ESM
    {
      ...commonOptions,
      format: ["esm"],
      outExtension: () => ({ js: ".mjs" }),
      dts: true,
      clean: true,
      outDir: "./lib/esm/",
    },
    // Support Webpack 4 by pointing `"module"` to a file with a `.js` extension
    {
      ...commonOptions,
      entry: {
        "index.legacy-esm": "src/index.ts",
      },
      format: ["esm"],
      outExtension: () => ({ js: ".js" }),
      target: "es2017",
      outDir: "./lib/esm/",
    },
    // Browser-ready ESM, production + minified
    {
      ...commonOptions,
      entry: {
        "index.browser": "src/index.ts",
      },
      define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      format: ["esm"],
      outExtension: () => ({ js: ".js" }),
      minify: true,
      noExternal: Object.keys(dependencies),
      skipNodeModulesBundle: false,
      splitting: false,
      outDir: "./lib/esm/",
    },
    // CJS
    {
      ...commonOptions,
      format: ["cjs"],
      outExtension: () => ({ js: ".cjs" }),
      dts: true,
      clean: true,
      outDir: "./lib/cjs/",
    },
    // CJS old extension
    {
      ...commonOptions,
      format: ["cjs"],
      outExtension: () => ({ js: ".js" }),
      clean: true,
      outDir: "./lib/cjs/",
    },
  ] as Options[];
});
