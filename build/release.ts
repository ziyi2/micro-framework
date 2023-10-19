import fs from "fs-extra";
import shell from "shelljs";
import semver from "semver";
import fetch from "node-fetch";
import simpleGit from "simple-git";
import path from "path";
import { Base } from "./base";
import { IPackageJson, ITarget } from "./type";

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
    // 打标签
    this.tag();
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

  async check() {
    const targets = this.getTargets();
    if (!targets?.length) return;
    // 单元测试检查
    this.checkUnitTest();
    // 发布分支检测
    await this.checkBranch();
    // 发布文件检测
    this.checkPublishFiles(targets);
    // 发布版本检测
    await this.checkLocalVersion(targets);
  }

  checkUnitTest() {
    const result = shell.exec("npm run test");
    if (result.code !== 0) {
      this.logError(`[发布失败]: 单元测试失败！`);
      process.exit(1);
    }
  }

  // 发布分支检测
  // 1、发布只能基于 master 分支进行（在 checkBranch 函数中进行卡口设置）
  // 2、所有的开发不能将本地 master 分支的变更 push 到远程的 master 分支（在 Github 上进行分支保护设置）
  // 3、所有的开发不能对本地 master 分支进行变更后再发布操作，防止本地偷偷发布没有 Code Review 的代码（在 checkBranch 函数中进行卡口设置）
  async checkBranch() {
    const git = simpleGit();
    const branch = await git.branchLocal();
    if (!/^demo/.test(branch?.current)) {
      // 这里以 github 为例，进行打印说明
      this.logError(
        `[发布失败]: 发布分支只能为 master 分支，请切换发布分支并提交 Pull Request 和 Code Review 流程进行发布！`
      );
      process.exit(1);
    }
    // 确保当前的 master 分支的文件没有变更（CD 流程需要自动生成 API 文档信息，因此会产生变更，这里跳过检测）
    // TODO:
    // const status = await git.status();
    // console.log("status: ", status);
    // if (status?.files?.length) {
    //   this.logError("[发布失败]: 不允许更改本地 master 代码！");
    //   process.exit(1);
    // }
    // 确保当前 master 分支的代码和远程代码一致（防止本地偷偷发布没有 Code Review 的代码）
    // 有没有其他方式可以比较本地 master 和远程 master 分支是一致的？
    const { stdout } = shell.exec("git diff origin/master master", {
      silent: true,
    });
    // 如果有打印信息，则说明存在差异
    if (stdout) {
      this.logError(
        `[发布失败]: 发布之前确保本地 master 分支和远程 master 分支内容一致！`
      );
      process.exit(1);
    }
  }

  // 检查 package.json 和 README.md 是否存在
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

  // 检查远程发布的版本是否大于本地待发布的版本（防止先发布 1.0.3，后发布 1.0.2）
  async checkLocalVersion(targets: ITarget[]) {
    const packageJson = this.getPackageJson();
    const localVersion = packageJson?.version as string;
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
        const remotePackage = (await res.json()) as IPackageJson;
        if (semver.gte(remotePackage?.version as string, localVersion)) {
          this.logError(
            `[发布失败]：当前 ${packageName} 需要发布的版本 ${localVersion} 小于等于已经发布的版本 ${
              remotePackage.version as string
            }！`
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
      const result = shell.exec("npm publish");
      if (result.code !== 0) {
        this.logError(`[发布失败]：${target.packagejson.name} 发布失败！`);
        shell.cd(this.rootPath);
        fs.ensureFileSync("release.log");
        fs.appendFileSync(
          "release.log",
          `${new Date().toLocaleString()}：${
            target.packagejson.name
          } 发布版本 ${packageJson?.version as string} 失败！\n失败原因：${
            result.stderr
          }`
        );
        process.exit(1);
      }
    });
  }

  tag() {
    shell.cd(this.rootPath);
    const packageJson = this.getPackageJson();
    const version = packageJson?.version as string;
    if (
      shell.exec(`git tag ${version}`).code !== 0 ||
      shell.exec(`git push origin ${version}`).code !== 0
    ) {
      process.exit(1);
    }
  }
}

void new Release().run();
