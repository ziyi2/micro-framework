# iframe 隔离的 Vue 微应用


``` bash
# 安装 Lerna 工具
npm install --global lerna

# 依赖安装并链接微应用包
lerna bootstrap

# 进入子应用进行构建
cd packages/vue-app
npm run build
```

将构建后的产物 `vue-app/dist/vue-app.umd.js` 放入 [iframe-sandbox-blank](https://github.com/ziyi2/micro-framework/tree/test/iframe-sandbox-blank) 分支的 `public/micro/micro1.js` 中进行测试。