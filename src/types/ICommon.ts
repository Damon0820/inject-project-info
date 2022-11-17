/**
 * 项目信息
 */
export interface IGitRepositryInfo {
  repositry: string;
  branch: string;
  lastCommitInfo: ILastCommitInfo;
  buildDate: string;
}

/**
 * 最后一次commit提交信息
 */
export interface ILastCommitInfo {
  committer: string;
  committerDate: string;
  commitMessage?: string;
}

/**
 * 插件参数
 */
export interface Options {
  isLog?: boolean;
  timeout?: boolean | number;
  isLogLastCommitMessage?: boolean;
  extraLogInfo?: IExtraLogInfo[];
}

/**
 * 用户传入的打印信息
 */
export interface IExtraLogInfo {
  label: string;
  value: string;
}

/**
 * 最终打印信息：项目信息 & 用户用户传入的打印信息
 */
export interface IProjectInfo extends IGitRepositryInfo {
  extraLogInfo: IExtraLogInfo[];
}
