export interface IGitRepositryInfo {
    repositry: string;
    branch: string;
    lastCommitInfo: ILastCommitInfo;
    buildDate: string;
}
export interface ILastCommitInfo {
    committer: string;
    committerDate: string;
    commitMessage?: string;
}
export interface Options {
    isLog?: boolean;
    timeout?: boolean | number;
    isLogLastCommitMessage?: boolean;
    extraLogInfo?: IExtraLogInfo[];
}
export interface IExtraLogInfo {
    label: string;
    value: string;
}
export interface IProjectInfo extends IGitRepositryInfo {
    extraLogInfo: IExtraLogInfo[];
}
