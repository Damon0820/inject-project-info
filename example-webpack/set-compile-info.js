/**
 * @description: 生成打包信息：项目名称、git分支、最新提交记录、打包时间等。方便开发环境定位问题，确认代码版本信息无误
 */

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * 补0
 * @param {Number} num 需要操作的数
 */
function appendZero(num) {
  if (num < 10) {
    return `0${num}`;
  }
  return num;
}

/**
 * 格式化日期
 * @param {Date} time 日期
 */
function formatDate(time) {
  const year = time.getFullYear();
  const month = appendZero(time.getMonth() + 1);
  const date = appendZero(time.getDate());
  const week = '日一二三四五六'.charAt(time.getDay());
  const hour = appendZero(time.getHours());
  const minute = appendZero(time.getMinutes());
  const second = appendZero(time.getSeconds());
  return `${year}-${month}-${date}(周${week}) ${hour}:${minute}:${second}`;
}

function readFile(path, cb) {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    cb(data);
  } catch (error) {
    process.env.VUE_APP_BRANCH = 'no branch info';
    console.warn('not file:', path);
  }
}

function getLastCommitInfo() {
  const commitId = execSync('git rev-parse HEAD')
    .toString()
    .trim();
  const commitAuthor = execSync(`git log --pretty=format:%cn ${commitId} -1`).toString();
  const commitDate = execSync(`git log --pretty=format:%ci ${commitId} -1`).toString();
  const commitMsg = execSync(`git log --pretty=format:%s  ${commitId} -1`).toString();

  const DateArr = commitDate.split(' ');
  DateArr.pop();
  const commitInfo = `
  - last commit info:
  - ${commitAuthor}
  - ${DateArr.join(' ')}
  - ${commitMsg}
  `;
  process.env.VUE_APP_COMMITINFO = commitInfo;
}

function setCompileInfo() {
  process.env.VUE_APP_DATE = formatDate(new Date());

  const url = execSync('git ls-remote --get-url origin')
    .toString()
    .split('/');
  const name = url[url.length - 1].replace(/\n|\r|.git/g, '');

  process.env.VUE_APP_REPOSITORY = name;

  // 获取版本名称
  try {
    // 优先获取git版本中的版本信息
    const branch = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .replace(/\s+/, '');
    // GitLab 拉取的git获取不到分支信息，用读取文件信息的方式
    if (branch === 'HEAD') throw new Error('no branch info');
    process.env.VUE_APP_BRANCH = branch;
  } catch (err) {
    readFile('./.git/HEAD', HEAD_DATA => {
      const index = HEAD_DATA.indexOf('/', 10) + 1;
      if (index === 0) {
        readFile('./.git/FETCH_HEAD', FETCH_DATA => {
          const dataList = FETCH_DATA.split('\n');
          for (const val of dataList) {
            if (HEAD_DATA.trim() === val.trim().split(/\s+/)[0]) {
              process.env.VUE_APP_BRANCH = val.split("'")[1];
              break;
            }
          }
        });
      } else {
        process.env.VUE_APP_BRANCH = HEAD_DATA.substr(index).trim();
      }
    });
  }
  getLastCommitInfo();
}

module.exports = setCompileInfo;
