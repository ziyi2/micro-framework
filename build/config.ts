import path from "path";
import { TargetTypeEnum } from "./type";


// 输出规范的目标集
export const targets = [
  {
    name: "build commonjs",
    type: TargetTypeEnum.CommonJS,
    tsconfig: {
      // 指定输出的模块化标准，例如课程中常说的 CommonJS 和 ES Module（ES2015/ES6/ES2020）
      // 中文查看（模块概念）：https://www.tslang.cn/docs/handbook/modules.html
      // 英文查看（模块编译示例）：https://www.typescriptlang.org/tsconfig/#module
      module: "CommonJS",
      // 指定输出的 JS 标准（ES3/ES5/ES6/.../ESNext）
      // 在课程中已经讲解 ES5 能够兼容大部分的浏览器
      target: "ES5",
    },
    dest: path.join(__dirname, "../lib/commonjs"),
  },
  {
    name: "build esmodule",
    type: TargetTypeEnum.ESModule,
    tsconfig: {
      module: "ES2015",
      target: "ES5",
    },
    dest: path.join(__dirname, "../lib/es"),
  },
];
