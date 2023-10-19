import gulp from "gulp";
import path from "path";
import ts from "gulp-typescript";
import merge2 from "merge2";
import { Base } from "./base";
import { ITarget } from "./type";

class GulpBuild extends Base {
  constructor() {
    super();
  }

  build(target: ITarget) {
    const tsProject = ts.createProject("../tsconfig.json", target.tsconfig);
    // tsProject.src() 默认会基于 tsconfig.json 中的 files、exclude 和 include 指定的源文件进行编译
    // const tsResult = tsProject.src().pipe(tsProject());
    // 由于这里需要过滤单元测试文件，因此使用 gulp.src，防止通过 tsProject.src() 读取 tsconfig.json 的 include 中的单元测试目录
    const tsResult = gulp
      .src(path.join(this.rootPath, "src/**/*.ts"))
      .pipe(tsProject());
    const tsDest = gulp.dest(target.dest, { overwrite: true });
    return merge2([tsResult.dts.pipe(tsDest), tsResult.js.pipe(tsDest)]);
  }

  run() {
    const targets = this.getTargets();
    targets.forEach((target) =>
      gulp.task(target.name, () => this.build(target))
    );
    gulp.task("default", gulp.parallel(targets.map((target) => target.name)));
  }
}

new GulpBuild().run();
