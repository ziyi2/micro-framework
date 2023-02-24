
module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  }
};
