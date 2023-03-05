import fs from "fs-extra";
import shell from "shelljs";
import semver from "semver";
import fetch from "node-fetch";
import path from "path";
import { Base } from "./base";
import { ITarget } from "./type";

class Release extends Base {
  constructor() {
    super();
  }

  async run() {
    // 拷贝 README.md 并生成 package.json
    this.prepare();
    // 发布预检
    await this.check();
    // 发布处理
    this.release();
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

  filterPackageJson(target: ITarget) {
    const packageJson = this.getPackageJson();
    const releasePackageJson: any = {};
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

  async check() {
    const targets = this.getTargets();
    if (!targets?.length) return;
    // 检查 package.json 和 README.md 是否存在
    this.checkPublishFiles(targets);
    // 检查远程发布的版本是否大于本地待发布的版本（防止先发布 1.0.3，后发布 1.0.2）
    await this.checkLocalVersion(targets);

    // // 检查远程发布的版本是否大于本地待发布的版本（防止先发布 1.0.3，后发布 1.0.2）
    // // http://registry.npmjs.org/packageName/latest
    // // semver.gte()
    // const remoteVersion = await fetch(`http://registry.npmjs.org/${tar}`)
  }

  checkPublishFiles(targets: ITarget[]) {
    targets.forEach((target) => {
      const checkFiles = ["package.json", "README.md"];
      checkFiles.forEach((file) => {
        const filePath = path.join(target.dest, file);
        if (!fs.existsSync(filePath)) {
          this.logError(`[发布失败]：${filePath} 不存在！`);
          process.exit(1);
        }
      });
    });
  }

  async checkLocalVersion(targets: ITarget[]) {
    const packageJson = this.getPackageJson();
    const localVersion = packageJson?.version;
    if (!localVersion) {
      this.logError(
        `[发布失败]：请填写 ${path.join(
          this.rootPath,
          "package.json"
        )} 中的 version 字段信息！`
      );
      process.exit(1);
    }

    for (const target of targets) {
      const packageName = target.packagejson?.name;
      if (packageName) {
        const res = await fetch(
          `http://registry.npmjs.org/${packageName}/latest`
        );
        const remotePackage = await res.json();
        if (semver.gte(remotePackage?.version, localVersion)) {
          this.logError(
            `[发布失败]：当前 ${packageName} 需要发布的版本 ${localVersion} 小于等于已经发布的版本 ${remotePackage.version}！`
          );
          process.exit(1);
        }
      }
    }
  }

  release() {
    const targets = this.getTargets();
    const packageJson = this.getPackageJson();
    targets.forEach((target) => {
      // 进入需要发布的目录文件夹，例如 lib/commonjs
      shell.cd(target.dest);

      // 使用 npm publish 执行发布
      // TODO：npm 可以做成一个工具函数，例如检测 cnpm、npm、yarn、pnpm 命令是否存在以及执行的优先级，`${getPackageManager()} publish`
      const result = shell.exec("npm publish")
      if (result.code !== 0) {
        this.logError(`[发布失败]：${target.packagejson.name} 发布失败！`);
        shell.cd(this.rootPath);
        fs.ensureFileSync("release.log");
        fs.appendFileSync(
          "release.log",
          `${new Date().toLocaleString()}：${
            target.packagejson.name
          } 发布版本 ${packageJson.version} 失败！\n失败原因：${result.stderr}`
        );
      }
    });
  }
}

new Release().run();
