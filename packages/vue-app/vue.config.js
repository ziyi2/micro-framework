const { defineConfig } = require("@vue/cli-service");
const { name } = require("./package.json");
const { v4: uuidv4 } = require("uuid");

const port = 8080;

// 确保全局对象属性的唯一性
// name: 保持微应用的可辨识性
// uuidv4: 保持全局唯一性
const appKey = `${name}_${uuidv4()}`;

module.exports = defineConfig({
  transpileDependencies: true,
  css: { extract: false },
  // 去除文件名哈希
  filenameHashing: false,

  publicPath: `//localhost:${port}/`,

  configureWebpack: {
    // 支持代码分割
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    output: {
      library: appKey,
      libraryTarget: "umd",
      chunkLoadingGlobal: `webpackJsonp_${appKey}`,
    },
  },
  devServer: {
    port: port, // 设置启动端口号
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
