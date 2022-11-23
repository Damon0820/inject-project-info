# 基于 rollup + typescript + pnpm + monorepo 搭建插件工具库的一次实战

> 本文以 inject-project-info 插件为例，讲述基于 rollup + typescript + pnpm + monorepo 搭建插件工具库的一次实战

1. 首先先介绍一些 inject-project-info 插件的使用场景、使用方式、效果展示。
2. 然后以 inject-project-info 项目代码为例，介绍一下代码组织结构。
3. 再依次介绍项目中使用的到技术点：rollup + typescript + pnpm + monorepo。

## inject-project-info 插件

- 项目 github 地址：https://github.com/Damon0820/inject-project-info

### 使用场景

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

### 详细用法和介绍

详细用法和介绍见[文档](https://github.com/Damon0820/inject-project-info)

### 项目目录结构总览

- example-vite // 测试示例 1-基于 vite 的项目
  - src
  - package.json
- example-vue-cli4 // 测试示例 2-基于 vue-cli 构建的项目
  - src
  - package.json
- example-webpack // 测试示例 3-基于原生 webpack 构建的项目
  - src
  - package.json
- lib // 插件 bundle 产物
- src // 插件源码
  - common
  - vite
  - webpack
- pnpm-workspace.yaml // pnpm 的 workspace 配置文件
- rollup.config.js // rollup 配置文件
- tsconfig.json
- package.json

## rollup

### rollup 是什么

Rollup 是一个 JavaScript 模块打包工具，可以将多个小的代码片段编译为完整的库和应用。与 webpack 偏向于应用打包的定位不同，rollup 更专注于类库打包。Rollup 使用的是 es 模块标准。[官方文档](https://www.rollupjs.com/)

### 为什么选 rollup

- rollup 配置简洁、性能到位和功能专一。
- rollup 是对代码的组合，打包产物纯净，而 webpack 有大量的代码垫片，增加产物体积。
  ```js
  'use strict';
  (self.webpackChunktest_webpack = self.webpackChunktest_webpack || []).push([
    [826],
    {
      973: function () {
        console.log('a');
      },
    },
    function (e) {
      var t;
      (t = 973), e((e.s = t));
    },
  ]);
  ```
- rollup 支持 treeShaking

类库代码主要都是 ts/js，用 rollup 打包十分合适。像常见前端框架 react 与 vue，其源码都是基于 rollup 打包的。

### 一个简单的 rollup 示例：

在根目录中创建 package.json 文件，执行`npm i rollup -D`安装依赖。`"scripts"`字段配置脚本命令`"build": "rollup -c"`

```json
package.json
{
	"name": "rollup",
	"version": "1.0.0",
	"main": "dist/index.js",
	"scripts": {
		"build": "rollup -c"
	},
	"engines": {
		"node": ">=13.2.0",
		"npm": ">=6.13.1"
	},
	"devDependencies": {
		"rollup": "2.75.5"
	}
}
```

在项目中创建以下业务文件与配置文件

- src/a.js
- src/b.js
- src/index.js
- rollup.config.js

```js
// src/a.js
export function helloA() {
  const msg = 'a';
  console.log(msg);
}

// src/b.js
export function helloB() {
  const msg = 'a';
  console.log(msg);
}

// src/index.js
import { helloA } from './a.js';
import { helloB } from './b.js';

helloA();
```

```js
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.bundle.js',
    format: 'es',
  },
};
```

执行 `npm run build` 生成 dist/index.bundle.js 文件。经过摇树优化后，生成内容为：

```js
function helloA() {
  const msg = 'a';
  console.log(msg);
}

helloA();
```

有一个细节的地方，const 并未转换为 var。若使用更多 ESM 的语法与 API，也会出现一样的情况，所以通过观察可发现 rollup 的打包流程是将那些使用过的代码块合并为一个或多个 bundle 文件，只起到一个搬运工的作用。

### rollup 用法介绍

在 inject-project-info 项目中，rollup 配置文件主要使用到了以下配置项。

- `input` 入口文件。
- `output.file` bunle 文件输出路径及文件名
- `output.format` 输出模块标准。可选 amd，cjs，es，iife，umd，system。
- `external` npm 模块清单。
- `plugins` 插件，常用的有 cleandir，typescript，nodeResolve，commonjs，terser 等。

1. inject-project-info 项目中要同时输出 webpack 插件和 vite 插件，每个插件又有 es 模块版本和 cjs 模块版本。所以需要配置多套 input 和 output 方案。配置文件 rollup.config.js 接受导出一个**数组**的形式让我们可以配置多套配置。
2. rollup 由于本身功能很简单，所以依赖插件去实现其他功能。项目用到 ts，所以要使用`@rollup/plugin-typescript`插件编译 ts 文件，并将 ts 配置文件`tsconfig`的输出目标语言设置为 es5。打包后输出.d.ts 声明文件和 es5 语言的 js 文件。
3. 在默认情况下，rollup 只会解析相对模块 ID，意味着导入语句 `import Xyz from "xyz"`不会让 Npm 模块应用到 bundle 文件中。若要让 Npm 模块应用到 bundle 文件中，需告知 rollup 如何找到它。安装`@rollup/plugin-node-resolve`，使用该插件自动寻找引用到的 Npm 模块。
   在配置了插件后，默认会将所有 npm 模块的代码打包到 bundle 文件。如果一些 npm 模块不想打包进 bundle，需要在`extenal`字段中配置声明为外部模块。
4. 由于 Rollup 使用的是 es 的模块标准。有些 Npm 模块在引用时导入的 bundle 文件的模块规范可能是 CJS，例如 jquery、day 等，而 rollup 在普通情况下无法解析 CJS。安装`@rollup/plugin-commonjs`，使用该插件将 CJS 转换为 ESM 再让其参与到后续编译中。
5. 每次打包之前，要先清空上一次打包的产物。安装 `rollup-plugin-cleandir`，仅在数组配置项的第一个中配置此插件。则会在打包开始前，清理 lib 文件夹。
6. 如果是 bundle 代码被使用环境是项目的生产依赖，可以优化压缩 bundle 文件的体积，安装 `rollup-plugin-terser`，启动代码压缩。

inject-project-info 项目的[rollup 配置文件](https://github.com/Damon0820/inject-project-info)示例：

```js
import commomjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { cleandir } from 'rollup-plugin-cleandir';
import { terser } from 'rollup-plugin-terser';

const plugins = [commomjs(), nodeResolve(), typescript()];
const pluginsHasTerser = [
  ...plugins,
  terser({
    compress: { drop_console: false },
    format: { comments: false },
  }),
];

module.exports = [
  // webpack插件
  {
    input: './src/webpack/index.ts',
    output: {
      file: './lib/webpack.js',
      format: 'es',
    },
    plugins: plugins,
    external: [
      'git-repo-info',
      'child_process',
      'webpack-sources',
      'webpack-sources/lib/RawSource',
    ],
  },
  {
    input: './src/webpack/index.ts',
    output: {
      file: './lib/webpack.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    plugins: plugins,
    external: [
      'git-repo-info',
      'child_process',
      'webpack-sources',
      'webpack-sources/lib/RawSource',
    ],
  },

  // vite插件
  {
    input: './src/vite/index.ts',
    output: {
      file: './lib/vite.js',
      format: 'es',
    },
    plugins: plugins,
    external: ['git-repo-info', 'child_process'],
  },
  {
    input: './src/vite/index.ts',
    output: {
      file: './lib/vite.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    plugins: plugins,
    external: ['git-repo-info', 'child_process'],
  },
];
```

## package.json 配置导出子模块

inject-project-info 插件同时提供了 webpack 插件版本和 vite 插件版本。传统的 main,types 字段只能配置主模块的入口文件和入口声明文件，而这里需要分别导出两个插件及其对应声明文件，所以项目中在 package.json 文件`exports`字段配置导出多子模块，更好的支持 ts 类型提示。目前各大开源仓库也都使用到 exports 的身影，包括 vue，vite，element-plus，unplugin-auto-import 等。具体配置如下；

```json
  // package.json
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "require": "./lib/index.cjs",
      "import": "./lib/index.js"
    },
    "./*": "./*",
    "./webpack": {
      "types": "./lib/webpack/index.d.ts",
      "require": "./lib/webpack.cjs",
      "import": "./lib/webpack.js"
    },
    "./vite": {
      "types": "./lib/vite/index.d.ts",
      "require": "./lib/vite.cjs",
      "import": "./lib/vite.js"
    }
  },

```

在使用的时候，则引入的路径为`inject-project-info/vite`，而不写成`inject-project-info/lib/vite`，就会通过 exports 的子模块配置，找到对应的入口文件和有 ts 类型声明文件。而在低于 v4.5 版本的 ts 无法找到子模块对应的声明文件，需要再配置一下`typesVersions`字段兼容低版本 ts。[参见资料](https://stackoverflow.com/questions/58990498/new-package-json-exports-field-not-working-with-typescript)

```json
  // package.json
  "typesVersions": {
    "*": {
      "*": [
        "./lib/*"
      ],
      "vite": [
        "./lib/vite/index.d.ts"
      ],
      "webpack": [
        "./lib/webpack/index.d.ts"
      ]
    }
  }

```

## pnpm + monorepo

### pnpm

pnpm 全称为 perfomance npm，号称高性能 npm 包管理工具。按照官网说法，可以实现节约磁盘空间并提升安装速度和创建非扁平化的 node_modules 文件夹两大目标，具体原理可以参考 [pnpm 官网](https://www.pnpm.cn/motivation)和[文章](https://jishuin.proginn.com/p/763bfbd3bcff)。

### momorepo

monorepo 全称为 monolithic repository，即单体式仓库。是管理项目代码的一个方式，指在一个项目仓库 (repo) 中管理多个模块/包 (package)，与之对应的是 multirepo(multiple repository)，即每个项目对应一个仓库。monorepo 和 multirepo 有各自的一些优缺点和使用场景。
monorepo 在子模块互相依赖的场景下比较适合使用。可以极大的方便调试，而无需经过发包，再更新依赖的过程。

### workspace

- pnpm 提出了 workspace 的概念，内置了对 monorepo 的支持。

## 使用实践

1. 首先安装 pnpm
   `npm install -g pnpm`
2. 在根目录下创建 pnpm-workspace.yaml 文件，配置子模块如下，即可将 example-vite，example-vue-cli4，example-webpack 下拥有 package.json 文件的目录声明为工作区下的子模块

```yaml
packages:
  - 'example-vite'
  - 'example-vue-cli4'
  - 'example-webpack'
```

3. 子模块间相互引用，使用 `workspace:`协议安装依赖。这里在 example-vite，example-vue-cli4，example-webpack 模块使用 安装 inject-project-info 插件，自动会使用`workspace:协议`安装。则每个子模块下实际引用的 inject-project-info 会通过软链接到本地工作区的 inject-project-info 模块，而不会下载远程 npm 包。实现源码级别的调试。
   `pnpm install inject-project-info/webpack -rD`
   -r 代表所有子模块都会安装
   -D 代表安装到开发依赖下

```json
  // package.json
  "devDependencies": {
    "inject-project-info": "workspace:^1.0.14"
  },
```

可以将版本号 `workspace:^1.0.14` 改成 `workspace:\*`，这样就可以保持在 example-vite，example-vue-cli4，example-webpack 示例项目中做测试的时候，依赖的版本是工作空间里最新版本。避免了繁琐的调试流程：inject-project-info 插件源码修改 -> 构建插件 bundle 产物 -> 升级版本号发布到 npm -> 每个 example-x 示例项目更新插件最新版本。有些同学可能会有疑问，在 example-x 示例项目直接使用相对路径引用 inject-project-info/lib 下的文件效果不是一样吗？答案是不完全一样。首先 node 解析依赖的机制就不一样。还可能出现模块标准解析上的区别。为了模拟真实用户使用场景，使用模块名的方式引入是更好的。
当 pnpm publish 的时候，会自动将 package.json 中的 workspace:xx 修正为对应的版本号。
使用 pnpm + monorepo 管理项目还有许多其他功能特性，有兴趣的同学可以详细研究。或许某些业务代码仓库也适用此方式去管理的。

#### 只允许 pnpm

当在项目中使用 pnpm 时，如果不希望用户使用 yarn 或者 npm 安装依赖，可以将下面的这个 preinstall 脚本添加到工程根目录下的 package.json 中：

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

至此，我们修改了插件代码，使用`npm run build`输出最新 bundle 在 lib 文件夹下，而 example 子模块直接引用到最新的 lib 文件夹下的文件，即可验证本地最新版本的插件代码。若验证通过，可通过`npm version patch`更新补丁包版本号并会自动提交代码，然后可发布到 npm。
