module.exports = (api) => {
  api.cache(true);

  return {
    babelrcRoots: [
      // Keep the root as a root
      ".",
      // Also consider monorepo packages "root" and load their .babelrc files.
      "./packages/*",
    ],
    presets: [
      [
        "@babel/preset-env",
        {
          modules: "cjs",
        },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
    plugins: [
      [
        "lodash",
        {
          id: ["lodash"],
        },
      ],
      [
        "import",
        {
          libraryName: "antd",
          libraryDirectory: "lib",
          style: true,
        },
        "ant",
      ],
      [
        "import",
        {
          libraryName: "antd-mobile",
          libraryDirectory: "cjs",
          style: true,
        },
        "antd-mobile",
      ],
      [
        "import",
        {
          libraryName: "react-use",
          libraryDirectory: "lib",
          camel2DashComponentName: false,
        },
        "react-use",
      ],
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true,
        },
      ],
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-transform-runtime",
      // "react-hot-loader/babel",
    ],
    env: {
      build: {
        ignore: ["dist"],
      },
    },
    ignore: ["node_modules"],
  };
};
