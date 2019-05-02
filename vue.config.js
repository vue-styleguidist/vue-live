module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./demo/main.js");

    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
    if (process.env.NODE_ENV === "production" && process.env.LIB_MAKING) {
      config.externals(
        [
          "acorn",
          "buble",
          "walkes",
          "hash-sum",
          "vue-template-compiler",
          "rewrite-imports",
          "prismjs"
        ].reduce((exts, pkg) => {
          exts[pkg] = pkg;
          return exts;
        }, {})
      );
    }
  }
};
