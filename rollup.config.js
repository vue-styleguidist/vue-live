import * as path from "path";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import vue from "rollup-plugin-vue";
import css from "rollup-plugin-css-only";
import pkg from "./package.json";

const resolve = _path => path.resolve(__dirname, _path);

export default {
  input: resolve("./src/main.js"),
  output: [
    {
      file: pkg.main,
      name: "VueLive",
      format: "umd"
    },
    {
      file: pkg.module,
      format: "es" // the preferred format
    }
  ],
  plugins: [
    commonjs(),
    babel({
      babelrc: false,
      // avoid using babel.config.js that kills es6 modules for ie compatibility
      configFile: "./babel.rollup.js",
      presets: [["@vue/babel-preset-app", { useBuiltIns: false }]],
      extensions: [".js"],
      runtimeHelpers: true
    }),
    vue(),
    css()
  ],
  external: [
    ...Object.keys(pkg.dependencies),
    // make sure jsx schema is loaded from external
    "prismjs/components/prism-jsx.min"
  ]
};
