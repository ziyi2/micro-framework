# qiankun 微前端示例

## 启动命令

```bash
# 安装依赖
npm i

# 依赖安装并链接微应用包，注意这里使用了项目里的 lerna 6.x 版本，不要使用全局安装的 lerna 
npm run bootstrap

# 启动 react 和 vue 微应用的开发态
npm run start

# 进入主应用启动
cd packages
cd main-app
npm start
```

## 构建 qiankun

由于 qiankun 内部的 `@types/node` 在默认情况下会被提升到项目根目录的 `node_modules` 中，为此这里开启了  `nohoist` 配置，并且采用 yarn 进行构建，因此如果要进入 qiankun 目录构建产物，需要先安装 yarn。
