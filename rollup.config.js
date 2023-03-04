import * as path from "path";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import node from "@rollup/plugin-node-resolve";
import vue from "rollup-plugin-vue";
import vue2 from "rollup-plugin-vue2";
import css from "rollup-plugin-css-only";
import analyze from "rollup-plugin-analyzer";
import pkg from "./package.json";

const resolve = (_path) => path.resolve(__dirname, _path);

const rootConfig = {
  input: resolve("./src/index.js"),
  plugins: [
    commonjs(),
    node(),
    babel({
      babelrc: false,
      // avoid using babel.config.js. It kills es6 modules for ie compatibility
      configFile: "./babel.rollup.js",
      extensions: [".js"],
      babelHelpers: "runtime",
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
    "vue",
  ],
};

export default ['vue2', 'vue3'].reduce((acc, currentValue) => ([].concat(acc, [
  // ESM build to be used with webpack/rollup.
  {
    ...rootConfig,
    output: {
      format: "esm",
      file: currentValue === 'vue2' ? pkg.module : pkg.module.replace('vue-live.', 'vue3/vue-live.'),
    },
    plugins: [
      (currentValue === 'vue2' ? vue2 : vue)({ 
        css: false 
      }), 
      ...rootConfig.plugins
    ],
  },
  // SSR build.
  {
    ...rootConfig,
    output: {
      format: "cjs",
      file: currentValue === 'vue2' ? pkg.main : pkg.main.replace('vue-live.', 'vue3/vue-live.'),
      exports: "named", // remove warning about mixed exports
    },
    plugins: [
      (currentValue === 'vue2' ? vue2 : vue)({ 
        css: false, 
        template: { 
          optimizeSSR: true
        } 
      }),
      ...rootConfig.plugins,
    ],
  },
])), []);
