'use strict';

var child_process = require('child_process');
var getGitRepInfo = require('git-repo-info');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var getGitRepInfo__default = /*#__PURE__*/_interopDefaultLegacy(getGitRepInfo);

function appendZero(num) {
    if (num < 10) {
        return "0".concat(num);
    }
    return num;
}
function formatDate(time) {
    var year = time.getFullYear();
    var month = appendZero(time.getMonth() + 1);
    var date = appendZero(time.getDate());
    var week = "日一二三四五六".charAt(time.getDay());
    var hour = appendZero(time.getHours());
    var minute = appendZero(time.getMinutes());
    var second = appendZero(time.getSeconds());
    return "".concat(year, "-").concat(month, "-").concat(date, "(\u5468").concat(week, ") ").concat(hour, ":").concat(minute, ":").concat(second);
}

function getGitRepositryInfo(isLogLastCommitMessage) {
    if (isLogLastCommitMessage === void 0) { isLogLastCommitMessage = true; }
    var url = child_process.execSync("git ls-remote --get-url origin").toString().split("/");
    var repositry = url[url.length - 1].replace(/\n|\r|.git/g, "");
    var gitRepInfo = getGitRepInfo__default["default"]();
    var branch = gitRepInfo.branch, committer = gitRepInfo.committer, commitMessage = gitRepInfo.commitMessage;
    var committerDate = gitRepInfo.committerDate;
    committerDate = formatDate(new Date(committerDate));
    var lastCommitInfo = {
        committer: committer,
        committerDate: committerDate,
        commitMessage: isLogLastCommitMessage
            ? commitMessage
            : "Last Commit Message Has Been hidden",
    };
    var buildDate = formatDate(new Date());
    var gitRepositryInfo = {
        repositry: repositry,
        branch: branch,
        lastCommitInfo: lastCommitInfo,
        buildDate: buildDate,
    };
    return gitRepositryInfo;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function getLogProjectInfoTemp(gitRepositryInfo, options) {
    var projectInfo = __assign(__assign({}, gitRepositryInfo), { extraLogInfo: Array.isArray(options.extraLogInfo)
            ? options.extraLogInfo
            : [] });
    var projectInfoStr = JSON.stringify(projectInfo);
    var timeout = options.timeout;
    var logStr = "";
    if (timeout === false) {
        logStr = "logProjectInfo(projectInfo)";
    }
    else {
        logStr = "setTimeout(() => {\n        logProjectInfo(projectInfo)\n      }, ".concat(timeout, ");");
    }
    var logProjectInfoFnTemp = "function logProjectInfo(projectInfo) {\n        if (!projectInfo) {\n          console.error(\"\u3010\u6253\u5305\u4FE1\u606F\u63D2\u4EF6\u3011 \u786E\u4FDD\u4F20\u5165logProjectInfo()\u65B9\u6CD5\u6B63\u786E\u7684\u9879\u76EE\u6253\u5305\u4FE1\u606F\");\n          return;\n        }\n        var repositry = projectInfo.repositry, branch = projectInfo.branch, lastCommitInfo = projectInfo.lastCommitInfo, buildDate = projectInfo.buildDate, extraLogInfo = projectInfo.extraLogInfo;\n        var titleStyle = \"padding: 0 20px;background: #ded92a;text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:24px;height:36px;line-height:36px;text-align:center;margin-bottom:8px;margin-top: 4px\";\n        var textTitleStyle = \"color: #b2b942; font-size: 16px;line-height: 24px;\";\n        var textStyle = \"color: #888; font-size: 16px;line-height: 24px;\";\n        var logInfoStr = \"%c \u7248\u672C\u6253\u5305\u4FE1\u606F\";\n        var logArgs = [];\n        var logInfos = [\n          { label: \"Repositry\", value: \"\".concat(repositry, \" -> \").concat(branch) },\n          {\n            label: \"Last Commit\",\n            value: \"\".concat(lastCommitInfo.committer, \" -> \").concat(lastCommitInfo.committerDate),\n          },\n          { label: \"Build Date\", value: \"\".concat(buildDate) },\n        ];\n        if (Array.isArray(extraLogInfo)) {\n          logInfos = logInfos.concat(extraLogInfo);\n        }\n        for (var i = 0; i < logInfos.length; i++) {\n          var _a = logInfos[i], label = _a.label, value = _a.value;\n          logInfoStr = logInfoStr + \"%c \\n\".concat(label, \": %c \").concat(value);\n          logArgs.push(textTitleStyle);\n          logArgs.push(textStyle);\n        }\n        logArgs = [logInfoStr, titleStyle].concat(logArgs);\n        console.log.apply(null, logArgs);\n      }";
    return "\n  <script>\n    (function() {\n      const projectInfo = ".concat(projectInfoStr, "\n      ").concat(logProjectInfoFnTemp, "\n      ").concat(logStr, "\n    })()\n  </script>\n  ");
}

var DEFAULT_OPTIONS = {
    isLog: true,
    timeout: 2000,
    isLogLastCommitMessage: false,
    extraLogInfo: [],
};
var mergeDefaultAndUserOptions = function (userOptions) {
    var options = __assign({}, DEFAULT_OPTIONS);
    if (typeof userOptions === "undefined") {
        return options;
    }
    var isLog = userOptions.isLog, timeout = userOptions.timeout, isLogLastCommitMessage = userOptions.isLogLastCommitMessage, extraLogInfo = userOptions.extraLogInfo;
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

function InjectProjectInfoVitePlugin(userOptions) {
    var options = mergeDefaultAndUserOptions(userOptions);
    return {
        name: "InjectProjectInfoVitePlugin",
        transformIndexHtml: function (html) {
            if (!options.isLog) {
                return html;
            }
            var bodyEndTagIndex = html.indexOf("</body>");
            var bodyEndTagPreStr = html.slice(0, bodyEndTagIndex);
            var bodyEndTagAftStr = html.slice(bodyEndTagIndex);
            var logProjectInfoTemp = getLogProjectInfoTemp(getGitRepositryInfo(options.isLogLastCommitMessage), options);
            var res = bodyEndTagPreStr + logProjectInfoTemp + bodyEndTagAftStr;
            console.log("\x1B[35m", "\n【打包信息插件】 成功注入项目打包信息，可在控制台查看");
            return res;
        },
    };
}

module.exports = InjectProjectInfoVitePlugin;
