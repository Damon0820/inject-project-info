import { Plugin } from "vite";
import { getGitRepositryInfo } from "../index";
import getLogProjectInfoTemp from "../common/getLogProjectInfoTemp";
import { Options } from "../types/ICommon";
import { mergeDefaultAndUserOptions } from "../common/config";

export default function InjectProjectInfoVitePlugin(
  userOptions: Options
): Plugin {
  const options = mergeDefaultAndUserOptions(userOptions);
  // const transformIndexHtml: IndexHtmlTransformHook;
  return {
    name: "InjectProjectInfoVitePlugin",
    transformIndexHtml(html) {
      // console.log(html)
      if (!options.isLog) {
        return html;
      }
      const bodyEndTagIndex = html.indexOf("</body>");
      const bodyEndTagPreStr = html.slice(0, bodyEndTagIndex);
      const bodyEndTagAftStr = html.slice(bodyEndTagIndex);
      const logProjectInfoTemp = getLogProjectInfoTemp(
        getGitRepositryInfo(options.isLogLastCommitMessage),
        options
      );
      // console.log(eval(logProjectInfoTemp));
      const res = bodyEndTagPreStr + logProjectInfoTemp + bodyEndTagAftStr;
      // console.log("结果res: ", res);
      console.log(
        "\x1B[35m",
        "\n【打包信息插件】 成功注入项目打包信息，可在控制台查看"
      );
      return res;
    },
  };
}
