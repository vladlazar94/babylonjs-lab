const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  name: "Main app",
  target: "web",
  mode: "development",
  entry: "./src/index.ts",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "assets"),
      publicPath: "/assets",
    },
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.(t|j)sx?$/, loader: "ts-loader", exclude: /node_modules/ },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "assets"),
          to: path.resolve(__dirname, "docs", "assets"),
        },
      ],
    }),
  ],
};
