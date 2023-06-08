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
const proxyMain = require("./proxy.json");
const proxyTDVW = require("./proxy-tdvw.json");
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

const proxy = process.env.CHAIN_TDVW ? proxyTDVW : proxyMain;

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
  module: {
      rules: [ 
          { 
              test: /config\.json$/, 
              use: [{
                loader: path.resolve(__dirname, './configJsonLoader.js'),
                options: {
                  tdvw: !!process.env.CHAIN_TDVW
                },
              }] ,
              type: "javascript/auto"
          }
    ]
  },
  devServer: {
    // disableHostCheck: true,
    // webpack5 require
    static: OUTPUT_PATH,
    host: "0.0.0.0",
    port: 3000,
    compress: true,
    hot: true,
    // hotOnly: true,
    // inline: false,
    historyApiFallback: true,
    proxy: proxyServer,
    // before(app) {
    //   app.all("*", (req, res, next) => {
    //     let mockFile = mockMapper[req.path];
    //     if (isObject(mockFile)) {
    //       mockFile = mockFile[req.query.path];
    //     }
    //     if (mockFile && devMode === "local") {
    //       res.sendFile(
    //         path.resolve(__dirname, mockFile),
    //         {
    //           headers: {
    //             "Content-Type": "application/json; charset=utf-8",
    //           },
    //         },
    //         (err) => {
    //           err && console.error(err);
    //         }
    //       );
    //     } else {
    //       next();
    //     }
    //   });
    // },
  },
};

module.exports = merge(baseConfig, devConfig);
