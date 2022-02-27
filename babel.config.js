module.exports = {
  presets: ["@vue/app"],
  overrides: [
    {
      include: ["node_modules"],
      presets: [
        [
          "@babel/env"
        ]
      ]
    }
  ]
};
