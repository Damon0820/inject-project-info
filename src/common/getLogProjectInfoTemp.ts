import { IProjectInfo, IGitRepositryInfo } from "../types/ICommon";
import { Options } from "../types/ICommon";

export default function getLogProjectInfoTemp(
  gitRepositryInfo: IGitRepositryInfo,
  options: Options
) {
  // 合并git项目信息和用户额外指定的打印信息
  const projectInfo = {
    ...gitRepositryInfo,
    extraLogInfo: Array.isArray(options.extraLogInfo)
      ? options.extraLogInfo
      : [],
  };
  const projectInfoStr = JSON.stringify(projectInfo);
  const { timeout } = options;
  // 动态获取log执行代码
  let logStr = "";
  if (timeout === false) {
    logStr = `logProjectInfo(projectInfo)`;
  } else {
    logStr = `setTimeout(() => {
        logProjectInfo(projectInfo)
      }, ${timeout});`;
  }

  // 1. logProjectInfoFnTemp函数模板来自../lib/index.js。后续考虑优化为fs读取引入
  // 2. \n 替换为 \\n。解决字符被转义问题
  // 3. 模板注意缩进，以此保证最终输出缩进格式恰当
  const logProjectInfoFnTemp = `function logProjectInfo(projectInfo) {
        if (!projectInfo) {
          console.error("【打包信息插件】 确保传入logProjectInfo()方法正确的项目打包信息");
          return;
        }
        var repositry = projectInfo.repositry, branch = projectInfo.branch, lastCommitInfo = projectInfo.lastCommitInfo, buildDate = projectInfo.buildDate, extraLogInfo = projectInfo.extraLogInfo;
        var titleStyle = "padding: 0 20px;background: #ded92a;text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:24px;height:36px;line-height:36px;text-align:center;margin-bottom:8px;margin-top: 4px";
        var textTitleStyle = "color: #b2b942; font-size: 16px;line-height: 24px;";
        var textStyle = "color: #888; font-size: 16px;line-height: 24px;";
        var logInfoStr = "%c \u7248\u672C\u6253\u5305\u4FE1\u606F";
        var logArgs = [];
        var logInfos = [
          { label: "Repositry", value: "".concat(repositry, " -> ").concat(branch) },
          {
            label: "Last Commit",
            value: "".concat(lastCommitInfo.committer, " -> ").concat(lastCommitInfo.committerDate),
          },
          { label: "Build Date", value: "".concat(buildDate) },
        ];
        if (Array.isArray(extraLogInfo)) {
          logInfos = logInfos.concat(extraLogInfo);
        }
        for (var i = 0; i < logInfos.length; i++) {
          var _a = logInfos[i], label = _a.label, value = _a.value;
          logInfoStr = logInfoStr + "%c \\n".concat(label, ": %c ").concat(value);
          logArgs.push(textTitleStyle);
          logArgs.push(textStyle);
        }
        logArgs = [logInfoStr, titleStyle].concat(logArgs);
        console.log.apply(null, logArgs);
      }`;

  return `
  <script>
    (function() {
      const projectInfo = ${projectInfoStr}
      ${logProjectInfoFnTemp}
      ${logStr}
    })()
  </script>
  `;
}
