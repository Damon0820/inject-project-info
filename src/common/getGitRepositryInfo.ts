import { execSync } from "child_process";
import getGitRepInfo from "git-repo-info";
import { formatDate } from "./utils";
import { IGitRepositryInfo, ILastCommitInfo } from "../types/ICommon";

/**
 *
 * @param isLogLastCommitMessage 是否返回最后提交最后提交信息
 * @returns
 */
export default function getGitRepositryInfo(
  isLogLastCommitMessage = true
): IGitRepositryInfo {
  // 获取项目名
  const url = execSync("git ls-remote --get-url origin").toString().split("/");
  const repositry = url[url.length - 1].replace(/\n|\r|.git/g, "");
  // console.log(repositry);

  // 获取git项目最新提交记录信息
  const gitRepInfo = getGitRepInfo();
  // console.log(gitRepInfo);
  const { branch, committer, commitMessage } = gitRepInfo;
  let { committerDate } = gitRepInfo;
  committerDate = formatDate(new Date(committerDate));
  const lastCommitInfo: ILastCommitInfo = {
    committer,
    committerDate,
    commitMessage: isLogLastCommitMessage
      ? commitMessage
      : "Last Commit Message Has Been hidden",
  };

  // 获取当前时间
  const buildDate = formatDate(new Date());

  const gitRepositryInfo: IGitRepositryInfo = {
    repositry,
    branch,
    lastCommitInfo,
    buildDate,
  };
  // console.log(gitRepositryInfo);
  return gitRepositryInfo;
}
