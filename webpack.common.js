const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: ["babel-polyfill", "./src/js/index.js"], // file name: path
    // vendor: "./src/vendor.js" // file name: path
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    //   {
    //     test: /\.(svg|jpe?g|png|gif)$/i,
    //     use: {
    //       loader: "file-loader",
    //       options: {
    //         name: "[name].[ext]",
    //         outputPath: "img",
    //         esModule: false,
    //       },
    //     },
    //   },
    ],
  },
};
