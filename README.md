# single-spa 微前端示例

这里的 single-spa 使用了 [5.9.5](https://github.com/single-spa/single-spa/tree/v5.9.5) 版本，由于加入了很多打印信息，因此这里没有采用 submodules 的方式进行引入。

## 启动命令

```bash
# 安装依赖
npm i

# 依赖安装并链接微应用包，注意这里使用了项目里的 lerna 6.x 版本，不要使用全局安装的 lerna 
npm run bootstrap

# 启动 react 和 vue 微应用的开发态
npm run start

# 进入主应用启动
cd packages/main-app
npm start
```
