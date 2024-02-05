/**
 * @file 开发配置
 * @author atom-yang
 */

/* eslint-env node */
const merge = require("webpack-merge");
const path = require("path");
const http = require("http");
const https = require("https");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const minimist = require("minimist");
const { isObject } = require("lodash");
const mockMapper = require("./mock.json");
const { OUTPUT_PATH } = require("./util");
const proxy = require("./proxy.json");
const baseConfig = require("./webpack.base");

const defaultTargetOptions = {
  // dev-mode, 开发方式，local - 本地mock开发，test - 联调开发
  string: ["dev-mode"],
  default: {
    "dev-mode": "test",
  },
};
const args = minimist(process.argv.slice(2), defaultTargetOptions);
const devMode = args["dev-mode"];

const proxyServer =
  devMode === "local"
    ? {}
    : proxy.map((v) => {
        const agent = v.target.match("https")
          ? https.globalAgent
          : http.globalAgent;
        console.log("v.target.match('https')", !!v.target.match("https"), v);

        return {
          context: v.context,
          target: v.target,
          changeOrigin: true,
          secure: false,
          proxyTimeout: 8000,
          agent: agent,
          pathRewrite: v.pathRewrite,
          onProxyReq(proxyReq) {
            const { headers } = v;
            Object.keys(headers).forEach((v) => {
              proxyReq.setHeader(v, headers[v]);
            });
          },
        };
      });

const devConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    filename: "[name].js",
  },
  plugins: [new MiniCssExtractPlugin()],
  devServer: {
    // disableHostCheck: true,
    // webpack5 require
    static: OUTPUT_PATH,
    host: "0.0.0.0",
    port: 3001,
    compress: true,
    hot: true,
    // hotOnly: true,
    // inline: false,
    historyApiFallback: true,
    proxy: proxyServer,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  },
};

module.exports = merge(baseConfig, devConfig);
