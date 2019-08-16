import * as path from "path";
import cjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import vue from "rollup-plugin-vue";
import css from "rollup-plugin-css-only";

const resolve = _path => path.resolve(__dirname, _path);

export default {
  input: resolve("./src/main.js"),
  output: [
    {
      file: resolve(`./dist/vue-live.common.js`),
      format: "cjs",
      exports: "named"
    },
    {
      file: resolve(`./dist/vue-live.esm.js`),
      format: "esm"
    }
  ],
  plugins: [
    cjs(),
    babel({
      babelrc: false,
      presets: [["@vue/babel-preset-app", { useBuiltIns: false }]],
      extensions: [".js"],
      runtimeHelpers: true
    }),
    vue(),
    css()
  ],
  external: [
    "debounce",
    "vue-inbrowser-compiler",
    "prismjs",
    "prismjs/components/prism-jsx.min",
    "vue-prism-editor",
    "hash-sum"
  ]
};
