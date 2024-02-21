const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: { extract: false },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    output: {
      library: "vueMicroApp",
      libraryTarget: "umd",
      chunkLoadingGlobal: `webpackJsonp_vueMicroApp`,
    },
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
