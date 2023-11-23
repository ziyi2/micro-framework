# single-spa 微前端示例

- `pakcages` 目录是主应用和微应用的集成
- `submodules` 目录是三方库包

## git submodules

在 micro-framwork 根目录下执行以下命令添加 submodules 的执行步骤，例如以 single-spa 为例：

```bash
# 添加 single-spa 仓库到 submodules 目录下
git submodule add https://github.com/single-spa/single-spa.git submodules/single-spa
# 进入 single-spa 目录切换 5.9.5 版本
cd submodules/single-spa
git checkout v5.9.5
```

> 温馨提示：更多关于 submodules 的信息可以查看 [官方文档](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)。


## Lerna 配置

为了可以使得 single-spa 成为 lerna 的子模块，需要在 `package.json` 中添加如下配置：

``` json
"workspaces": [
  "packages/*",
  "submodules/*"
],
```

## 启动命令

``` bash
# 安装依赖
npm i

# 依赖安装并链接微应用包
npm run bootstrap

# 进入子应用进行构建
cd packages/vue-app
npm run build
cd ..
cd react-app
npm run build

# 进入主应用启动
cd ..
cd main-app
npm start
```
