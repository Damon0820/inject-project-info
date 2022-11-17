'use strict';

var RawSource = require('webpack-sources/lib/RawSource');
var child_process = require('child_process');
var getGitRepInfo = require('git-repo-info');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var RawSource__default = /*#__PURE__*/_interopDefaultLegacy(RawSource);
var getGitRepInfo__default = /*#__PURE__*/_interopDefaultLegacy(getGitRepInfo);

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

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

var PLUGIN_NAME = "InjectProjectInfoWebpackPlugin";
var InjectProjectInfoWebpackPlugin = (function () {
    function InjectProjectInfoWebpackPlugin(userOptions) {
        this.options = mergeDefaultAndUserOptions(userOptions);
    }
    InjectProjectInfoWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, function (compilation, callback) {
        });
        compiler.hooks.emit.tapAsync(PLUGIN_NAME, function (compilation, callback) { return __awaiter(_this, void 0, void 0, function () {
            var assets, htmlReg, filename, asset, assetSource, bodyEndTagIndex, bodyEndTagPreStr, bodyEndTagAftStr, logProjectInfoTemp, res;
            return __generator(this, function (_a) {
                if (!this.options.isLog) {
                    callback();
                    return [2, true];
                }
                assets = compilation.assets;
                htmlReg = /\.html$/;
                for (filename in assets) {
                    asset = assets[filename];
                    assetSource = asset.source();
                    if (htmlReg.test(filename)) {
                        bodyEndTagIndex = assetSource.indexOf("</body>");
                        bodyEndTagPreStr = assetSource.slice(0, bodyEndTagIndex);
                        bodyEndTagAftStr = assetSource.slice(bodyEndTagIndex);
                        logProjectInfoTemp = getLogProjectInfoTemp(getGitRepositryInfo(this.options.isLogLastCommitMessage), this.options);
                        res = bodyEndTagPreStr + logProjectInfoTemp + bodyEndTagAftStr;
                        compilation.assets[filename] = new RawSource__default["default"](res);
                        console.log("\x1B[35m", "\n【打包信息插件】 成功注入项目打包信息，可在控制台查看");
                    }
                }
                callback();
                return [2];
            });
        }); });
    };
    return InjectProjectInfoWebpackPlugin;
}());

module.exports = InjectProjectInfoWebpackPlugin;
