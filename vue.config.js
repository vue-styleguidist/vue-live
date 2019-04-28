module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./demo/main.js");

    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");

    config.externals({
      "codemirror/lib/codemirror.css": "codemirror/lib/codemirror.css",
      "codemirror/mode/vue/vue.js": "codemirror/mode/vue/vue.js",
      "vue-codemirror": "vue-codemirror",
      acorn: "acorn",
      buble: "buble",
      walkes: "walkes",
      "hash-sum": "hash-sum",
      "vue-template-compiler": "vue-template-compiler",
      "rewrite-imports": "rewrite-imports"
    });
  }
};
