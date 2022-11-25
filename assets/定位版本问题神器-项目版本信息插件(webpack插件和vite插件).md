# 定位版本问题神器-项目版本信息插件(webpack 插件和 vite 插件)

> 一个项目实用的工具类插件，分别提供了 **_webpack 插件_** 版本和 **_vite 插件_**版本。打包项目时自动注入项目打包信息，可在控制台日志查看，方便定位版本问题。项目打包信息包括：git 仓库信息、打包时间和用户指定的任意信息。

😈 前提： 在打包工具的配置文件中引入使用插件，打包项目时(`npm run build`)，插件会自动将项目版本信息的代码通过 scirpt 标签动态注入到打包产物的 html 中。所以也要求业务代码的打包产物是有 html 文件的。（业务项目都有吧 😏。。。）

## inject-project-info 插件

- 项目 github 地址：https://github.com/Damon0820/inject-project-info

## 使用场景

是否大家遇到过类似的问题：某天测试提了一些 bug 给开发人员 A，开发人员 A 表示这些 bug 已经修复并自测发版了，本不应该在线上出现这些 bug，对此感到疑惑。可能的原因有：

1. 测试本地有缓存或者版本更新机制出问题等其他原因，不是最新版本。
2. 测试本地是最新版，开发人员 A 记错了，改了 bug 但是忘记发版。
3. 测试本地是最新版，开发人员 A 也修复了 bug 并发过版本。但是开发人员 B 未拉取开发人员 A 提交的代码（或开发人员 A 代码未推送到远程仓库），直接发了一个更新的版本，覆盖了开发人员 A 发的版本。
4. 等等其他原因。。。

这个原因其实指向的是同一个问题-**版本问题**。原因 1 是未更新到最新版导致的。原因 2 忘记发版，线上版本不是预期的最新版本。 原因 3 比较隐蔽，虽然是最新版本，但是版本代码未同步更新到其他人的代码导致的。版本代码不是预期。
那么有没有一个比较快速和方便的方法去定位这个版本问题。inject-project-info 插件提供了一种方法，记录当前版本打包的时间和 git 仓库最近一次提交记录等信息辅助我们去定位版本问题。

首先，前提是发版人员记得自己打包项目（执行`npm run build`）的时间，这个时间记录到 Build Date 中。作为当前版本的标志信息。换句话说，打包时间约等于版本标识。那么遇到上述问题，可以这么定位：

1. 比对测试本地的打包时间和开发人员 A 本地版本的打包时间，假如不一致，且测试的时间更早，说明测试本地不是最新版，需要刷新或者清缓存等手段，升级到最新版。
1. 开发人员 A 本地版本的打包时间和测试本地打包时间一致，并且打包时间早于开发人员 A 改 bug 的时间，说明开发人员记错了，改完 bug 未发版
1. 开发人员 A 本地版本的打包时间和测试本地打包时间一致，并且打包时间晚于开发人员 A 记忆中的发版时间，说明有开发人员 B 在开发人员 A 之后发版，并且未同步到开发人员 A 的代码。
1. 等等其他场景。。。

以上列举了一些场景，打包信息的打包时间信息给了强有力的方向指引，去定位可能出现版本问题的原因。这也是项目打包信息带给我们的收益之一，经常能辅助我们快速定位版本问题，减少疑惑，发现具体原因，进而规避减少版本问题出现。
插件除了预置打印打包时间，还预置打印了 git 项目信息，包括 git 项目名称，分支名称，最近一次提交记录信息。git 项目信息也可以定位一些问题，比如线上版本的代码来自哪个分支，代码最新提交是什么时候。除了预置信息外，
插件还支持打印用户传入自定义信息，比如可以打印项目 package.json 的版本 version 等。

## 插件介绍

> 更多详细用法和介绍也可参见[文档](https://github.com/Damon0820/inject-project-info)

## INSTALL

```js
 // npm
 npm i inject-project-info -D
 // pnpm
 pnpm add inject-project-info -D
```

## USAGE

> 结合打包工具 webpack 和 vite 使用，分别提供对应的插件。

```ts
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

// webpack plugin
new InjectProjectInfoWebpackPlugin(options: Options),
// vite plugin
injectProjectInfoVitePlugin(options: Options),

```

### 1. 结合 webpack 使用

#### 1.1. webpack 构建的项目使用示例：

```js
// webpack.config.js (webpack配置文件)

const InjectProjectInfoWebpackPlugin = require('inject-project-info/webpack');

module.exports = {
  // ...其他配置
  plugins: [
    new InjectProjectInfoWebpackPlugin({
      isLog: process.env.NODE_ENV !== 'development', // 只在生产模式注入项目信息
    }),
  ],
};
```

#### 1.2. vue-cli 创建的项目（底层也是基于 webpack 构建工具）使用示例：

```js
// vue.config.js (配置文件)

const InjectProjectInfoWebpackPlugin = require("inject-project-info/webpack");

module.exports = {
  // ...其他配置
  configureWebpack: () => {
    new InjectProjectInfoWebpackPlugin({
      isLog: process.env.NODE_ENV !== "development", // 只在生产模式注入项目信息
    }),
  },
};
```

#### 2. 结合 vite 使用

#### vite 构建的项目使用示例：

```js
// vite.config.js (vite配置文件)

import { defineConfig } from 'vite';
import injectProjectInfoVitePlugin from 'inject-project-info/vite';

export default defineConfig({
  // ...其他配置
  plugins: [
    injectProjectInfoVitePlugin({
      isLog: !process.argv.includes('development'), // 只在生产模式注入项目信息。
    }),
  ],
});
```

特别说明：因为 vite 项目在 vite.config.js 获取 process.env.NODE_ENV 为 undefined，需要使用其他方法判断是否是生产环境。
可使用 cross-env 定义环境变量，或更简单点，在 package.json 的生产构建命令，必须显示指定--mode prodution 参数，则使用 process.argv.includes('production')判断是否是生产环境。示例如下：

```json
// package.json示例
{
  "scripts": {
    "dev": "vite --mode development",
    "build": "vue-tsc && vite build --mode production",
    "preview": "vite preview"
  }
}
```

## 参数说明

### options

| 参数名称               |                                                                                             说明 |              类型 | 默认值 |
| :--------------------- | -----------------------------------------------------------------------------------------------: | ----------------: | -----: |
| isLog                  |               控制插件是否注入项目打包信息，并打印到控制台。<br>推荐在生产环境开启，开发环境关闭 |           boolean |   true |
| timeout                |                        控制控制台是否延迟打印打包信息。传 false 可关闭，传数值设置延迟 x(ms)打印 | boolean 或 number |   2000 |
| isLogLastCommitMessage |                                  是否打印最新提交记录的 commit message。考虑信息敏感原因建议关闭 |           boolean |  false |
| extraLogInfo           | 用户额外指定的打印信息。比如有维护 package.json 的版本号的项目，可打印当前 package.json 的版本号 |   IExtraLogInfo[] |     [] |

### extraLogInfo

| 参数名称 |         说明 |   类型 | 默认值 |
| :------- | -----------: | -----: | -----: |
| label    | 信息左边标题 | string |     '' |
| value    | 信息右边内容 | string |     '' |

## 效果

包括以下信息：

- 项目名称 -> git 分支
- 最近一次提交记录：提交人 -> 提交时间（commit message 可能为敏感信息不建议不展示）。
- 打包时间
- 用户额外指定的打印信息

下方代码示例及其对应的效果图展示如下：

```js
new InjectProjectInfoWebpackPlugin({
  timeout: 3000, // 延迟3s打印
  isLog: process.env.NODE_ENV !== "development", // 只在开发环境开启
  // isLogLastCommitMessage: true,
  extraLogInfo: [ // 用户额外指定的打印信息
    {
      label: "Version",
      value: require("./package.json").version,
    },
    {
      label: "其他信息",
      value: "需要打印什么就打印什么",
    },
  ],
}),
```

<img src="./assets/inject-show.jpeg" style="width: 400px; display: block;">

## Todos

1. 内置实现打印项目构建依赖实际版本。
2. commit 信息打印 commit hash
