import { Options } from "../types/ICommon";

// 插件默认配置
export const DEFAULT_OPTIONS: Options = {
  // 是否打印日志。一般可在development模式关闭，其他模式（production）开启。默认开启
  isLog: true,
  // 延迟打印，单位（ms）,默认2000。可传
  timeout: 2000,
  // 是否打印最新提交记录的提交信息，默认false（考虑信息敏感原因）
  isLogLastCommitMessage: false,
  // 额外用户指定的打印信息
  extraLogInfo: [],
};

/**
 *
 * @param userOptions 合并传入插件的用户参数和默认参数
 * @returns
 */
export const mergeDefaultAndUserOptions = (userOptions?: Options): Options => {
  // use default options
  const options = { ...DEFAULT_OPTIONS };
  if (typeof userOptions === "undefined") {
    return options;
  }
  // merge user options
  const { isLog, timeout, isLogLastCommitMessage, extraLogInfo } = userOptions;
  if (typeof isLog === "boolean") {
    options.isLog = isLog;
  }
  if (typeof timeout === "boolean" || typeof timeout === "number") {
    options.timeout = timeout === true ? DEFAULT_OPTIONS.timeout : timeout;
  }
  if (typeof isLogLastCommitMessage === "boolean") {
    options.isLogLastCommitMessage = isLogLastCommitMessage;
  }
  if (Array.isArray(extraLogInfo)) {
    options.extraLogInfo = extraLogInfo;
  }
  return options;
};
