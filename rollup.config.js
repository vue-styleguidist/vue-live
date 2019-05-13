import * as path from "path";
import cjs from "rollup-plugin-commonjs";
import node from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import vue from "rollup-plugin-vue";
import css from "rollup-plugin-css-only";
import json from "rollup-plugin-json";

const resolve = _path => path.resolve(__dirname, _path);

export default {
  input: resolve("./src/main.js"),
  output: [
    {
      file: resolve(`./dist/vue-live.common.js`),
      format: "cjs"
    },
    {
      file: resolve(`./dist/vue-live.esm.js`),
      format: "esm"
    }
  ],
  plugins: [
    cjs(),
    node(),
    babel({
      babelrc: false,
      presets: [["@vue/babel-preset-app", { useBuiltIns: false }]],
      extensions: [".js"],
      runtimeHelpers: true
    }),
    vue(),
    css(),
    json()
  ],
  external: [
    "acorn",
    "buble",
    "walkes",
    "hash-sum",
    "vue-template-compiler",
    "rewrite-imports",
    "prismjs",
    "prismjs/components/prism-jsx.min",
    "vue-prism-editor"
  ]
};
