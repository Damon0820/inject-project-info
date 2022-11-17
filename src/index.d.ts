/**
 * 将所有ts类型打包到一个声明文件
 */
import getProjectInfo from "./common/getProjectInfo";
import logProjectInfo from "./common/logProjectInfo";
import InjectProjectInfoWebpackPlugin from "./webpack/index";
import InjectProjectInfoVitePlugin from "./vite/index";

export {
  getProjectInfo,
  logProjectInfo,
  InjectProjectInfoWebpackPlugin,
  InjectProjectInfoVitePlugin,
};
