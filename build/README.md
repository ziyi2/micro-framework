# 构建说明

借助 ts-node 可以使用 TypeScript 进行开发。

## 脚本说明

构建的脚本命令在 `package.json` 中：

``` json
"scripts": {
    // 构建产物
    "build": "ts-node build/build.ts",
    // 发布版本
    "release": "ts-node build/release.ts"
},
```

## 注意事项

``` typescript
// 以下库包的最新版本只有 ES Modules 规范输出
// 配合 ts-node 使用时，默认使用 CommonJS 规范，因此采用老的 CommonJS 老版本
// 关于 Pure ESM：https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
import chalk from "chalk";
import fetch from "node-fetch";
```