import { IProjectInfo, IExtraLogInfo } from "../types/ICommon";

/**
 * 通用打印项目信息方法。
 */
export default function logProjectInfo(projectInfo: IProjectInfo) {
  if (!projectInfo) {
    console.error(
      "【打包信息插件】 确保传入logProjectInfo()方法正确的项目打包信息"
    );
    return;
  }
  const { repositry, branch, lastCommitInfo, buildDate, extraLogInfo } =
    projectInfo;

  const titleStyle =
    "padding: 0 20px;background: #ded92a;text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:24px;height:36px;line-height:36px;text-align:center;margin-bottom:8px;margin-top: 4px";
  const textTitleStyle = "color: #b2b942; font-size: 16px;line-height: 24px;";
  const textStyle = "color: #888; font-size: 16px;line-height: 24px;";
  // let logInfoStr = `%c 版本打包信息%c \nRepositry: %c ${repositry} -> ${branch}%c \nLast Commit: %c ${lastCommitInfo.committer} -> ${lastCommitInfo.committerDate}%c \nBuild Date: %c ${buildDate}`;
  let logInfoStr = `%c 版本打包信息`;
  let logArgs = [];
  let logInfos: IExtraLogInfo[] = [
    { label: "Repositry", value: `${repositry} -> ${branch}` },
    {
      label: "Last Commit",
      value: `${lastCommitInfo.committer} -> ${lastCommitInfo.committerDate}`,
    },
    { label: "Build Date", value: `${buildDate}` },
  ];
  if (Array.isArray(extraLogInfo)) {
    logInfos = logInfos.concat(extraLogInfo);
  }
  for (let i = 0; i < logInfos.length; i++) {
    const { label, value } = logInfos[i];
    logInfoStr = logInfoStr + `%c \n${label}: %c ${value}`;
    logArgs.push(textTitleStyle);
    logArgs.push(textStyle);
  }
  logArgs = [logInfoStr, titleStyle].concat(logArgs);
  console.log.apply(null, logArgs);
}
