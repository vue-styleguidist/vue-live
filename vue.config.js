module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./demo/main.js");

    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
  }
};
