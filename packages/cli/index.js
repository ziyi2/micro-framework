#! /usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const download = require("download-git-repo");
const { version, name } = require("./package.json");

const APP_TYPE = {
  MAIN: "main",
  MICRO: "micro",
};

program
  .name(name)
  .version(version)
  .description("微前端解决方案的 CLI 生成工具。");

program
  .command("create <app-name>")
  .description("创建主应用或微应用")
  .option("-t, --type <type>", "应用类型：main（主应用） 或 micro（微应用）")
  .action((appName, options) => {
    const appType = options.type;

    if (!appType || (appType !== APP_TYPE.MAIN && appType !== APP_TYPE.MICRO)) {
      console.error(chalk.red("请指定 --type 参数为 main 或 micro！"));
      return;
    }

    const spinner = ora(
      chalk.green(
        `正在创建${appType === APP_TYPE.MAIN ? "主应用" : "微应用"}，请稍等...`
      )
    ).start();

    // 主应用模板仓库地址：https://github.com/ziyi2/micro-framework-main
    // 微应用模板仓库地址：https://github.com/ziyi2/micro-framework-micro
    const repo =
      appType === APP_TYPE.MAIN
        ? "ziyi2/micro-framework-main"
        : "ziyi2/micro-framework-micro";

    // 从 Github 仓库中下载模板代码
    download(repo, appName, (err) => {
      if (err) {
        spinner.fail(chalk.red("创建失败！"));
        console.error(err);
      } else {
        spinner.succeed(chalk.green("创建成功！"));
        console.log(chalk.green(`cd ${appName}`));
        console.log(chalk.green("npm install"));
        console.log(chalk.green("npm run start"));
      }
    });
  });

program.parse(process.argv);
