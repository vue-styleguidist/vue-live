module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./demo/main.js");

    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
    if (process.env.NODE_ENV === "production") {
      config.externals({
        acorn: "acorn",
        buble: "buble",
        walkes: "walkes",
        "hash-sum": "hash-sum",
        "vue-template-compiler": "vue-template-compiler",
        "rewrite-imports": "rewrite-imports",
        prismjs: "prismjs"
      });
    }
  }
};
