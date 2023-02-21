const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
    // 将最外层立即执行的箭头函数改为 ES5 语法
    environment: {
      arrowFunction: false,
    },
  },
  // 对代码进行分离
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          // 将 ES6+ 语法转换成 ES5
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  // 将构建后的 JS 文件添加的 HTML 中
  plugins: [new HtmlWebpackPlugin()],
};
