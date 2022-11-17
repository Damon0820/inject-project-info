import type { Compiler } from "webpack";
import { Options } from "../types/ICommon";
export default class InjectProjectInfoWebpackPlugin {
    private options;
    constructor(userOptions?: Options);
    apply(compiler: Compiler): void;
}
