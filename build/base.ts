import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { targets } from "./config";
import { IPackageJson, ITarget } from "./type";

export class Base {
  public rootPath = "";
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

  getPackageJson() {
    return fs.readJSONSync(
      path.join(this.rootPath, "package.json")
    ) as IPackageJson;
  }

  logError(message: string) {
    console.error(chalk.red(message));
  }

  logInfo(message: string) {
    console.info(chalk.green(message));
  }
}
