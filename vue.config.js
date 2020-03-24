module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./demo/main.js");

    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
  },
  transpileDependencies:
    process.env.VUE_CLI_MODERN_BUILD || process.env.NODE_ENV !== "production"
      ? undefined
      : [
          "regexpu-core",
          "strip-ansi",
          "ansi-regex",
          "ansi-styles",
          "unicode-match-property-ecmascript",
          "unicode-match-property-value-ecmascript",
          "acorn-jsx",
          "camelcase",
          "regexpp"
        ]
};
