const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectProjectInfoWebpackPlugin = require('inject-project-info/webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin(),
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
    // new BundleAnalyzerPlugin(),
  ],
};
