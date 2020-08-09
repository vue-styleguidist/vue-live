import * as path from "path";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import vue from "rollup-plugin-vue";
import css from "rollup-plugin-css-only";
import analyze from "rollup-plugin-analyzer";
import pkg from "./package.json";

const resolve = (_path) => path.resolve(__dirname, _path);

export default {
  input: resolve("./src/index.js"),
  output: [
    {
      file: pkg.main,
      name: "VueLive",
      format: "cjs",
      exports: "named", // remove warning about mixed exports
    },
    {
      file: pkg.module,
      format: "es", // the preferred format
    },
  ],
  plugins: [
    commonjs(),
    babel({
      babelrc: false,
      // avoid using babel.config.js. It kills es6 modules for ie compatibility
      configFile: "./babel.rollup.js",
      extensions: [".js"],
      babelHelpers: "runtime",
    }),
    vue({
      template: {
        optimizeSSR: true,
      },
    }),
    css(),
    analyze({ summaryOnly: true }),
  ],
  external: [
    ...Object.keys(pkg.dependencies),
    // make sure jsx schema is loaded from external
    "@babel/runtime/helpers/slicedToArray",
    "@babel/runtime/helpers/defineProperty",
    "@babel/runtime/helpers/toConsumableArray",
    "prismjs/components/prism-core",
    "prismjs/components/prism-clike",
    "prismjs/components/prism-markup",
    "prismjs/components/prism-javascript",
    "prismjs/components/prism-jsx",
    "@vue/compiler-core/dist/compiler-core.cjs",
  ],
};
