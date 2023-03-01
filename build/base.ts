import path from "path";
import { targets } from "./config";
import { ITarget } from "./type";

export class Base {
  public rootPath: string = "";
  public destPaths: string[] = [];

  constructor() {
    this.rootPath = path.join(__dirname, "../");
    this.destPaths = targets.map((target) => target.dest);
  }

  getTargets(): ITarget[] {
    return targets;
  }

  // 是否需要平铺
  isFlat() {
    // package.json 中的 config 参数
    // https://docs.npmjs.com/cli/v8/configuring-npm/package-json#config
    return process.env.npm_package_config_flat;
  }
}
