/**
 * 一个webpack插件，自动将打印项目信息函数注入到业务代码中。
 * 方案：1. 在index.html或多页应用的所有*.html注入用<script>标签包裹的js代码（本项目应用此方案）
 *      2.  在入口文件注入js代码
 */

import type { Compiler, Compilation } from "webpack";
import RawSource from "webpack-sources/lib/RawSource";
import { getGitRepositryInfo } from "../index";
import getLogProjectInfoTemp from "../common/getLogProjectInfoTemp";
import { Options } from "../types/ICommon";
import { mergeDefaultAndUserOptions } from "../common/config";

const PLUGIN_NAME = "InjectProjectInfoWebpackPlugin";

export default class InjectProjectInfoWebpackPlugin {
  private options: Options;
  constructor(userOptions?: Options) {
    this.options = mergeDefaultAndUserOptions(userOptions);
  }
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(
      PLUGIN_NAME,
      (compilation: Compilation, callback) => {
        // 测试代码
        // console.log("谢谢你我是webpack插件");
        // const logProjectInfoTemp = getLogProjectInfoTemp(
        //   getProjectInfo(),
        //   this.options
        // );
        // console.log(logProjectInfoTemp);
      }
    );
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, async (compilation, callback) => {
      if (!this.options.isLog) {
        callback();
        return true;
      }
      // console.log(compilation.assets);
      const assets = compilation.assets;
      const htmlReg = /\.html$/;
      for (const filename in assets) {
        const asset = assets[filename];
        const assetSource = asset.source() as string;
        // html文件注入js脚本
        if (htmlReg.test(filename)) {
          // console.log(assetSource);
          // console.log(assetSource.indexOf("</body>"));
          const bodyEndTagIndex = assetSource.indexOf("</body>");
          const bodyEndTagPreStr = assetSource.slice(0, bodyEndTagIndex);
          const bodyEndTagAftStr = assetSource.slice(bodyEndTagIndex);
          const logProjectInfoTemp = getLogProjectInfoTemp(
            getGitRepositryInfo(this.options.isLogLastCommitMessage),
            this.options
          );
          // console.log(eval(logProjectInfoTemp));
          const res = bodyEndTagPreStr + logProjectInfoTemp + bodyEndTagAftStr;
          // console.log("结果res: ", res);
          compilation.assets[filename] = new RawSource(res);
          console.log(
            "\x1B[35m",
            "\n【打包信息插件】 成功注入项目打包信息，可在控制台查看"
          );
        }
      }
      // 处理产物
      callback();
    });
  }
}
