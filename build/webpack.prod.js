/**
 * @file prod 配置
 * @author atom-yang
 */

/* eslint-env node */
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require("./webpack.base");
const { OUTPUT_PATH, ROOT } = require("./util");

const nodeModule = (...segments) =>
  path.join(ROOT, "node_modules", ...segments);

const prodConfig = {
  mode: "production",
  resolve: {
    alias: {
      react: nodeModule("react", "umd", "react.production.min.js"),
      "react-dom": nodeModule(
        "react-dom",
        "umd",
        "react-dom.production.min.js"
      ),
    },
  },
  output: {
    path: OUTPUT_PATH,
    // path: path.resolve(OUTPUT_PATH, './static'),
    filename: "[name].[chunkhash:5].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:5].css",
    }),
  ],
  optimization: {
    moduleIds: "deterministic",
    removeEmptyChunks: true,
    sideEffects: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {},
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          autoprefixer: {
            disable: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "initial",
      minChunks: 1,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "initial",
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: (entryPoint) => `runtime.${entryPoint.name}`,
    },
  },
};

module.exports = merge(baseConfig, prodConfig);
