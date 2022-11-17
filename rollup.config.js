import commomjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { cleandir } from "rollup-plugin-cleandir";
import { terser } from "rollup-plugin-terser";

const plugins = [commomjs(), nodeResolve(), typescript()];
const pluginsHasTerser = [
  ...plugins,
  terser({
    compress: { drop_console: false },
    format: { comments: false },
  }),
];

module.exports = [
  // 导出一些方法
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/index.js",
      format: "es",
    },
    plugins: [...pluginsHasTerser, cleandir("lib")],
    external: ["git-repo-info", "child_process"],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/index.cjs",
      format: "cjs",
      exports: "auto",
    },
    plugins: pluginsHasTerser,
    external: ["git-repo-info", "child_process"],
  },

  // webpack插件
  {
    input: "./src/webpack/index.ts",
    output: {
      file: "./lib/webpack.js",
      format: "es",
    },
    plugins: plugins,
    external: [
      "git-repo-info",
      "child_process",
      "webpack-sources",
      "webpack-sources/lib/RawSource",
    ],
  },
  {
    input: "./src/webpack/index.ts",
    output: {
      file: "./lib/webpack.cjs",
      format: "cjs",
      exports: "auto",
    },
    plugins: plugins,
    external: [
      "git-repo-info",
      "child_process",
      "webpack-sources",
      "webpack-sources/lib/RawSource",
    ],
  },

  // vite插件
  {
    input: "./src/vite/index.ts",
    output: {
      file: "./lib/vite.js",
      format: "es",
    },
    plugins: plugins,
    external: ["git-repo-info", "child_process"],
  },
  {
    input: "./src/vite/index.ts",
    output: {
      file: "./lib/vite.cjs",
      format: "cjs",
      exports: "auto",
    },
    plugins: plugins,
    external: ["git-repo-info", "child_process"],
  },
];
