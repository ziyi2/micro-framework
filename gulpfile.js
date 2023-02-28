const gulp = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");

const task = {
  commonjs: {
    name: "build commonjs",
    tsconfig: {
      // 指定输出的模块化标准，例如课程中常说的 CommonJS 和 ES Module（ES2015/ES6/ES2020）
      // 中文查看（模块概念）：https://www.tslang.cn/docs/handbook/modules.html
      // 英文查看（模块编译示例）：https://www.typescriptlang.org/tsconfig/#module
      module: "CommonJS",
      // 指定输出的 JS 标准（ES3/ES5/ES6/.../ESNext）
      // 在课程中已经讲解 ES5 能够兼容大部分的浏览器
      target: "ES5",
    },
    dest: "lib/commonjs",
  },
  esmodule: {
    name: "build esmodule",
    tsconfig: {
      module: "ESNext",
      target: "ES5",
    },
    dest: "lib/es",
  },
};

function build(task) {
  const tsProject = ts.createProject("tsconfig.json", task.tsconfig);
  // tsProject.src() 默认会基于 tsconfig.json 中的 files、exclude 和 include 指定的源文件进行编译
  const tsResult = tsProject.src().pipe(tsProject());
  const tsDest = gulp.dest(task.dest, { overwrite: true });
  return merge([tsResult.dts.pipe(tsDest), tsResult.js.pipe(tsDest)]);
}

gulp.task(task.commonjs.name, () => build(task.commonjs));
gulp.task(task.esmodule.name, () => build(task.esmodule));
gulp.task("default", gulp.parallel([task.commonjs.name, task.esmodule.name]));
