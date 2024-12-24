# 框架设计

在之前的课程中，我们使用的是 lerna 6.x 版本（对于复杂项目的发布管理相对合适）进行多包管理。由于当前项目相对简单，我们直接使用 [npm workspaces](https://nodejs.cn/npm/cli/v7/using-npm/workspaces/) 来管理 micro-framework 库包的设计，从而可以免除 npm link 的步骤。

## 启动命令

```bash
# 安装依赖（packages 下的工作区会自动进行 npm link）
npm i

# 启动主应用、react 和 vue 微应用
npm run start
```
