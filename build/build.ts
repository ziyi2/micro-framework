import path from "path";
import fs from "fs-extra";
import shell from "shelljs";
import glob from "glob";
import chalk from "chalk";
import { Base } from "./base";
import { TargetTypeEnum } from "./type";

// package.json 中的 config 参数
// https://docs.npmjs.com/cli/v8/configuring-npm/package-json#config
const flat = process.env.npm_package_config_flat;

class Build extends Base {
  constructor() {
    super();
  }

  run() {
    // 构建初始化
    this.init();
    // 同步执行构建
    this.build();
    // 平铺构建
    this.flat();
  }

  init() {
    // 清空 lib 目录下的 commonjs 和 es 文件夹
    this.destPaths?.forEach(fs.emptyDirSync);
  }

  build() {
    // 构建参数
    // --gulpfile: 指定 gulpfile.js 的文件路径
    // --color: 构建时打印带颜色的日志
    shell.exec(
      `gulp --gulpfile ${path.join(__dirname, "gulpfile.ts")} --color `,
      {
        // 构建同步执行
        async: false,
        // 构建失败则退出进程
        fatal: true,
      }
    );
  }

  flat() {
    if (!this.isFlat()) {
      return;
    }

    // 对 commonjs 规范进行平铺处理（大家可以自行设计一下 ES Module 的平铺处理）
    const targets = this.getTargets();
    const commonjsTarget = targets?.find(
      (target) => target.type === TargetTypeEnum.CommonJS
    );
    if (!commonjsTarget) {
      return;
    }
    const destPath = commonjsTarget.dest;
    // 同步获取构建目录下的所有文件
    // 例如：files:  [
    //     'lib/commonjs/index.js',
    //     'lib/commonjs/core/core.js',
    //     ...
    //     'lib/es/index.js',
    //     'lib/es/core/core.js',
    //   ]
    const files = glob.globSync(`${destPath}/**/*.js`);

    // 如果存在相同的文件名称，则退出构建处理
    if (this.hasSameFileName(files)) {
      return process.exit(0);
    }

    // 进行构建文件的平铺处理
    this.buildFlatFiles(files, destPath);

    // 拷贝声明文件到一级目录下
    this.copyDeclarationFiles(destPath);

    // 清空构建的子文件夹
    this.emptyBuildSubDir(destPath);
  }

  hasSameFileName(files: string[]): boolean {
    // 目录平铺后必须确保不能产生同名文件，例如 lib/commonjs/index.js 和 lib/commonjs/core/index.js
    const fileRepeatMap: { [key: string]: string[] } = {};
    return files.some((file) => {
      // 将 lib/commonjs/index.js 转化为 index.js
      const fileName = file.substring(file.lastIndexOf("/") + 1);
      const fileRepeatArr = fileRepeatMap[fileName];
      // 存储 index.js 为文件名的文件路径数组，例如 { "index.js": ["lib/commonjs/index.js"] }
      fileRepeatMap[fileName] = fileRepeatArr
        ? [...fileRepeatArr, file]
        : [file];
      // 如果 index.js 的文件路径存在多个，则提示错误并退出进程，例如 { "index.js": ["lib/commonjs/index.js", "lib/commonjs/core/index.js" ] }
      if (fileRepeatMap[fileName]?.length > 1) {
        // 可以使用 chalk 打印颜色
        console.error(`[编译错误] 编译不允许存在相同的文件名称: ${fileName}`);
        console.error(
          `[编译错误] 相同的文件名称路径：${fileRepeatMap[fileName].join(", ")}`
        );
        return true;
      }
      return false;
    });
  }

  buildFlatFiles(files: string[], destPath: string) {
    // 如果没有同名文件，则进行文件平铺
    files.forEach((file) => {
      // 获取构建文件的目标代码
      let code = fs.readFileSync(file).toString();

      // 正则说明：
      // (?<=require\(")(.*?)(?="\)) 主要分为三部分: (?<=require\(")、(.*?)、(?="\))
      // (?<=require\("): 反向肯定预查, ?<=pattern, 用于匹配以 require(" 开头的字符串，注意 require\(" 是转义后的字符串，匹配的是 require("
      // (.*?): 用于匹配最短路径的内容，其中 ? 用于非贪婪匹配, * 是贪婪匹配，? 是只能匹配 0 ~ 1 次
      // (?="\)): 正向肯定预查，?=pattern, 用于匹配以 ") 结尾的字符串，注意 "\) 是转义后的字符串，匹配的是 ")

      // 正则场景解释:
      // 例如压缩后的代码： require("./core/core"),fs_1=__importDefault(require("fs")
      // 通过 (.*) 匹配后默认会匹配到 ./core/core"),fs_1=__importDefault(require("fs
      // 通过 (.*?) 匹配后默认会匹配到 ./core/core 和 fs
      // 其中 ? 的作用用于贪婪匹配中的 0 ~ 1 次, 从而阻止了 * 的 0 ~ n 次贪婪匹配

      // 平铺目录后需要将引入路径进行更改，因为平铺后目标文件的位置发送了变化，因此被引用的路径也需要改变
      // 例如在 src/index.ts 中需要引入 core/core.ts，使用 gulp 构建后是 require("./core/core");
      // 但是目录平铺之后 index.js 和 core.js 同级，因此希望将目标代码更改为 require("./core"); 需要去掉中间的目录路径 core

      //   ├── src
      //   │   ├── core/
      //   │   │   ├── core1/
      //   │   │   │   └── core1.ts
      //   │   │   └── core.ts
      //   │   └── index.ts
      //   ├── lib
      //   │   ├── commonjs/
      //   │   │   ├── package.json
      //   │   │   ├── core.ts
      //   │   │   ├── core1.ts
      //   │   │   └── index.ts
      //   │   ├── es/
      //   │   │   ├── package.json
      //   │   │   ├── core.ts
      //   │   │   ├── core1.ts
      //   │   │   └── index.ts

      // 转换引入路径，例如: require('./core/core') => require('./core')
      code = code.replace(/(?<=require\(")(.*?)(?="\))/g, (match) => {
        if (!match) {
          return match;
        }
        // 例如： match = './core/core'
        const paths = match.split("/");
        // 获取文件名
        const fileName = paths.concat().pop();
        // 不需要更改的引用路径的情况，例如 require("lodash")
        if (!fileName || paths.length === 1) {
          return match;
        }
        console.info(
          `[编译信息] 在文件 ${file} 中匹配和替换的 require 路径: `,
          `${match} => ./${fileName}`
        );
        // 平铺后直接引入同级目录下的文件
        return `./${fileName}`;
      });

      // TODO: 如果需要生成 sourcemap，则 sourcemap 的路径也需要处理

      // 删除当前目录下的目标文件，例如 lib/commonjs/core/core.js
      fs.rmSync(file);

      // 将 lib/commonjs/core/core.js 转化为 lib/commonjs/core.js
      const fileName = file.substring(file.lastIndexOf("/") + 1);
      // 生成平级文件的写入路径
      const fileOutputPath = path.join(destPath, fileName);
      // 写入更改后的目标代码
      fs.writeFileSync(fileOutputPath, code);
    });
  }

  copyDeclarationFiles(destPath: string) {
    const files = glob.globSync(`${destPath}/**/*.d.ts`);
    files.forEach((file) => {
      // 将 lib/commonjs/index.js 转化为 index.js
      const fileName = file.substring(file.lastIndexOf("/") + 1);
      if (file !== path.join(destPath, fileName)) {
        fs.copySync(file, path.join(destPath, fileName));
        fs.rmSync(file);
      }
    });
  }

  emptyBuildSubDir(destPath: string) {
    // 平铺完成后，匹配文件夹并删除空的文件夹
    // 匹配文件夹：to match only directories, simply put a / at the end of the pattern.
    // 反转以后可以从内到外进行文件夹删除（先删除内部的子文件夹）
    const dirs = glob.globSync(`${destPath}/**/`).reverse();

    dirs.forEach((dir) => {
      const subdirs = fs.readdirSync(dir);
      // 如果文件夹为空，则删除文件夹（注意从内到外进行删除，core/core1 的情况下先删除 core1 文件夹，再删除 core 文件夹）
      if (!subdirs?.length) {
        fs.rmdirSync(dir);
      }
    });
  }
}

new Build().run();

// const build = {
//   run() {
//     // 清除构建目录
//     this.clear();
//     // 同步执行 gulp 构建
//     // this.gulp();
//     // // 构建完成后，平铺构建目录
//     // this.flat();
//     // // 平铺完成后，准备发布 NPM 包
//     // this.prepublish();
//   },

//   clear() {
//     destPaths.forEach(fs_extra.emptyDirSync);
//   },

// gulp() {
//   // 构建参数
//   // --gulpfile: 指定 gulpfile.js 的文件路径
//   // --color: 构建时打印带颜色的日志
//   shell.exec(
//     `gulp --gulpfile ${path.join(__dirname, "gulpfile.cjs")} --color `,
//     {
//       // 构建同步执行
//       async: false,
//       // 构建失败则退出进程
//       fatal: true,
//     }
//   );
// },

// flat() {
//   // 如果没有平铺参数，则不进行平铺处理
//   if (!flat) {
//     return;
//   }

//   // 同步获取构建目录下的所有文件
//   // 例如：files:  [
//   //     'lib/commonjs/index.js',
//   //     'lib/commonjs/core/core.js',
//   //     ...
//   //     'lib/es/index.js',
//   //     'lib/es/core/core.js',
//   //   ]
//   const files = glob.sync(`${this.destPath}/**/*.js`);
//   const fileRepeatMap = {};

//   // 平铺目录需要确保不能产生同名文件，例如 lib/commonjs/index.js 和 lib/commonjs/core/index.js，因为文件名冲突导致无法生成 lib/commonjs/index.js
//   files.forEach((file) => {
//     // 将 lib/commonjs/index.js 转化为 a.js
//     const fileName = file.substring(file.lastIndexOf("/") + 1);
//     const fileRepeatArr = fileRepeatMap[fileName];
//     // 存储 a.js 为文件名的文件路径数组，例如 { "a.js": ["dist/A/a.js"] }
//     fileRepeatMap[fileName] = fileRepeatArr
//       ? [...fileRepeatArr, file]
//       : [file];
//     // 如果 a.js 的文件路径存在多个，则提示错误并退出进程，例如 { "a.js": ["dist/A/a.js", "dist/B/a.js" ] }
//     if (fileRepeatMap[fileName]?.length > 1) {
//       console.error("[编译错误] 编译不允许具备相同的文件名称: ", fileName);
//       console.error(
//         "[编译错误] 相同的文件名称路径：",
//         fileRepeatMap[fileName].join(", ")
//       );
//       // 清除构建目录
//       this.clear();
//       // 退出构建
//       process.exit();
//     }
//   });

//   // 如果没有同名文件，则进行文件平铺
//   files.forEach((file) => {
//     // 获取构建文件的目标代码
//     let code = fs.readFileSync(file).toString();

//     // 正则说明：
//     // (?<=require\(")(.*?)(?="\)) 主要分为三部分: (?<=require\(")、(.*?)、(?="\))
//     // (?<=require\("): 反向肯定预查, ?<=pattern, 用于匹配以 require(" 开头的字符串，注意 require\(" 是转义后的字符串，匹配的是 require("
//     // (.*?): 用于匹配最短路径的内容，其中 ? 用于非贪婪匹配, * 是贪婪匹配，? 是只能匹配 0 ~ 1 次
//     // (?="\)): 正向肯定预查，?=pattern, 用于匹配以 ") 结尾的字符串，注意 "\) 是转义后的字符串，匹配的是 ")

//     // 正则场景解释:
//     // 例如压缩后的代码： require("./common/e"),fs_1=__importDefault(require("fs")
//     // 通过 (.*) 匹配后默认会匹配到 ./common/e"),fs_1=__importDefault(require("fs
//     // 通过 (.*?) 匹配后默认会匹配到 ./common/e 和 fs
//     // 其中 ? 的作用用于贪婪匹配中的 0 ~ 1 次, 从而阻止了 * 的 0 ~ n 次贪婪匹配

//     // 平铺目录后需要将引入路径进行更改，因为平铺后目标文件的位置发送了变化，因此被引用的路径也需要改变
//     // 例如在 src/index.ts 中需要引入 A/a.ts，使用 gulp 构建后是 require("./A/a");
//     // 但是目录平铺之后 index.js 和 a.js 同级，因此希望将目标代码更改为 require("./a"); 需要去掉中间的目录路径 A

//     //   ├── src
//     //   │   ├── add.ts
//     //   │   ├── A/
//     //   │   │   ├── B/
//     //   │   │   │   └── b.ts
//     //   │   │   └── a.ts
//     //   │   └── C/
//     //   │   		└── c.ts
//     //   ├── dist
//     //   │   ├── package.json     # 新增包描述文件
//     //   │   ├── add.js
//     //   │   ├── a.js
//     //   │   ├── b.js
//     //   │   ├── c.js
//     //   │   ├── d.js
//     //   │   ├── index.js

//     // 例如: require('./A/a') => require('./a')
//     code = code.replace(/(?<=require\(")(.*?)(?="\))/g, (match) => {
//       if (!match) {
//         return match;
//       }
//       // 例如： match = './A/a'
//       const paths = match.split("/");
//       // 获取文件名
//       const fileName = paths.concat().pop();
//       // 不需要更改的引用路径，例如 require("lodash")
//       if (!fileName || paths.length === 1) {
//         return match;
//       }
//       console.info(
//         `[编译信息] 在文件 ${file} 中匹配和替换的 require 路径: `,
//         `${match} => ./${fileName}`
//       );
//       // 平铺后直接引入同级目录下的文件
//       return `./${fileName}`;
//     });

//     // TODO: 如果需要生成 sourcemap，则 sourcemap 的路径也需要处理

//     // 删除当前目录下的目标文件，例如 dist/A/a.js
//     fs.rmSync(file);

//     // 将 dist/A/a.js 转化为 a.js
//     const fileName = file.substring(file.lastIndexOf("/") + 1);
//     // 生成平级文件的写入路径
//     const fileOutputPath = path.join(this.distPath, fileName);
//     // 写入更改后的目标代码
//     fs.writeFileSync(fileOutputPath, code);
//   });

//   // 平铺完成后，匹配文件夹并删除空的文件夹
//   // 匹配文件夹：to match only directories, simply put a / at the end of the pattern.
//   // 反转以后可以从内到外进行文件夹删除（先删除内部的子文件夹）
//   const dirs = glob.sync(`${this.distPath}/**/`).reverse();

//   dirs.forEach((dir) => {
//     const subdirs = fs.readdirSync(dir);
//     // 如果文件夹为空，则删除文件夹（注意从内到外进行删除，A/B 的情况下先删除 B 文件夹，再删除 A 文件夹）
//     if (!subdirs?.length) {
//       fs.rmdirSync(dir);
//     }
//   });
// },

// 在项目根目录下使用 package.json 进行 NPM 发布，项目的引入路径为 import xxx from 'ziyi-sdk-demo/${outdir}/xxx'
// 如果将 package.json 拷贝到 outdir 目录下并进入 outdir 目录进行发布，则引入路径为 import xxx from 'ziyi-sdk-demo/xxx'
// 除此之外，天然解决了需要在 package.json 中配置 files 字段或者在项目目录中配置 .npmignore 的问题
// prepublish() {
//   // 拷贝 package.json 到 outdir 目录下
//   // TIPS: 可以去除一些开发者不需要感知的开发态信息，例如 scripts、devDependencies
//   fs.copyFileSync(
//     path.join(this.rootPath, "package.json"),
//     path.join(this.distPath, "package.json")
//   );

//   // 拷贝 README.md 到 outdir 目录下
//   fs.copyFileSync(
//     path.join(this.rootPath, "README.md"),
//     path.join(this.distPath, "README.md")
//   );
// },
// };

// // 运行构建
// build.run();
