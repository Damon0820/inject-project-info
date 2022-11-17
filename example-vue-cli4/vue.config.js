// const webpack = require("webpack");
const InjectProjectInfoWebpackPlugin = require('inject-project-info/webpack');
// const { getGitRepositryInfo } = require("../lib/index");
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      // new InjectProjectInfoWebpackPlugin(),
      // new webpack.DefinePlugin({
      //   "process.env.PROJECT_INFO": JSON.stringify({
      //     ...getGitRepositryInfo(),
      //     extraLogInfo: [
      //       {
      //         label: "Version",
      //         value: require("./package.json").version,
      //       },
      //     ],
      //   }),
      // }),
      // new BundleAnalyzerPlugin(),

      // new logProjectInfoWebpackPlugin(),

      new InjectProjectInfoWebpackPlugin({
        timeout: 3000,
        isLog: process.env.NODE_ENV !== 'development',
        // isLogLastCommitMessage: true,
        extraLogInfo: [
          {
            label: 'Version',
            value: require('./package.json').version,
          },
          {
            label: '其他想打印的信息',
            value: '需要打印什么就打印什么',
          },
        ],
      }),

      // new logProjectInfoWebpackPlugin({
      //   timeout: false,
      //   isLog: process.env.NODE_ENV !== "development",
      // }),
    ],
  },
};
