// 解决compilation.assets[filename] = new RawSource(res)类型报错
declare module "webpack-sources/lib/RawSource" {
  import { sources } from "webpack";
  export default sources.RawSource;
}
