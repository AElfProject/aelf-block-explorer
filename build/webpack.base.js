/**
 * @file 基础配置
 * @author atom-yang
 */

/* eslint-env node */

const path = require("path");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const {
  ROOT,
  OUTPUT_PATH,
  isProdMode,
  isTestNet,
  // ENTRIES,
  // PAGES,
  PUBLIC_PATH,
  getLessVariables,
} = require("./util");

const copies = [];

const baseConfig = {
  // entry: ENTRIES,
  entry: {
    app: [path.resolve(ROOT, "src/index.js")],
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: PUBLIC_PATH,
  },
  resolve: {
    alias: {
      process: "process/browser",
      "aelf-sdk": "aelf-sdk/dist/aelf.umd.js",
      "@config": path.resolve(ROOT, "config"),
      "@src": path.resolve(ROOT, "src"),
      "@pages": path.resolve(ROOT, "src/pages"),
      "@components": path.resolve(ROOT, "src/components"),
      "@utils": path.resolve(ROOT, "src/utils"),
      "@store": path.resolve(ROOT, "src/store"),
      "@api": path.resolve(ROOT, "src/api"),
      "@actions": path.resolve(ROOT, "src/redux/actions/"),
      "@redux": path.resolve(ROOT, "src/redux/"),
    },
    modules: [path.resolve(ROOT, "src"), path.resolve(ROOT, "node_modules")],
    extensions: [".jsx", ".js", ".mjs", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            rootMode: "upward",
            plugins: ["react-hot-loader/babel"],
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              modifyVars: getLessVariables(
                path.resolve(ROOT, "src/assets/less/_variables.less")
              ),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "static/img/[name]-[hash:5].[ext]",
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(#.+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "static/fonts/[name].[ext]",
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "@svgr/webpack",
            options: {
              babel: false,
              icon: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // ...PAGES.map(({ name, config }) => {
    //   let chunks = [name];
    //   const filename = path.resolve(OUTPUT_PATH, config.name || `${name}.html`);
    //   if (isProdMode) {
    //     const runtime = `runtime.${name}`;
    //     chunks = [runtime, "vendors", name];
    //   }
    //   return new HtmlWebpackPlugin({
    //     template: path.resolve(ROOT, "./template.ejs"),
    //     filename,
    //     chunks,
    //     name,
    //     title: config.title,
    //   });
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, "./template.ejs"),
      filename: "index.html",
      chunks: isProdMode ? ["runtime.app", "vendors", "app"] : ["app"],
      name: "app",
      title: "AELF Block Explorer",
      favicon: isTestNet
        ? "public/favicon.test.ico"
        : "public/favicon.main.ico",
      hash: true,
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new MomentLocalesPlugin({
      localesToKeep: ["es-us", "en-ca", "zh-cn"],
    }),
    new CopyWebpackPlugin(copies),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.RELOAD_ENV": JSON.stringify(process.env.RELOAD_ENV),
      "process.env.LOCALE": JSON.stringify(process.env.LOCALE || "zh"),
      PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
    }),
    new MonacoWebpackPlugin({
      languages: ["xml", "csharp", "json"],
      features: [
        "bracketMatching",
        "wordHighlighter",
        "comment",
        "find",
        "coreCommands",
        "links",
        "hover",
        "quickCommand",
        "goToDefinitionCommands",
        "goToDefinitionMouse",
        "gotoLine",
        "linesOperations",
      ],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};

module.exports = baseConfig;
