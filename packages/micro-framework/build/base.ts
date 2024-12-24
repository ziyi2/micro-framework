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

  filterPackageJson(target: ITarget) {
    const packageJson = this.getPackageJson();
    const releasePackageJson: { [key: string]: unknown } = {};
    [
      "name",
      "version",
      "description",
      "author",
      "license",
      "homepage",
      "dependencies",
    ].forEach((key) => {
      releasePackageJson[key] = packageJson[key];
    });
    return {
      ...releasePackageJson,
      ...target.packagejson,
    };
  }

  // 在项目根目录下使用 package.json 进行 NPM 发布，项目的引入路径为 import xxx from 'micro-framwork/lib/commonjs/xxx'
  // 如果将 package.json 拷贝到 lib/commonjs 目录下并进入 lib/commonjs 目录进行发布，则引入路径为 import xxx from 'micro-framwork/xxx'
  // 除此之外，天然解决了需要在 package.json 中配置 files 字段或者在项目目录中配置 .npmignore 的问题
  prepare() {
    const targets = this.getTargets();
    targets?.forEach((target) => {
      // 生成 package.json
      fs.writeJSONSync(
        path.join(target.dest, "package.json"),
        this.filterPackageJson(target),
        { spaces: 2 }
      );
      // 拷贝 README.md
      fs.copyFileSync(
        path.join(this.rootPath, "README.md"),
        path.join(target.dest, "README.md")
      );
    });
  }

  logError(message: string) {
    console.error(chalk.red(message));
  }

  logInfo(message: string) {
    console.info(chalk.green(message));
  }
}
