module.exports = {
  chainWebpack: (config) => {
    config
      .entry("app")
      .clear()
      .add("./demo/main.js");
  },
  transpileDependencies: [
    "regexpu-core",
    "strip-ansi",
    "ansi-regex",
    "ansi-styles",
    "unicode-match-property-ecmascript",
    "unicode-match-property-value-ecmascript",
    "acorn-jsx",
    "camelcase",
    "regexpp",
  ],
};
