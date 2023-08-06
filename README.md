# iframe 隔离的 Vue 微应用


``` bash
# 安装依赖
npm i

# 依赖安装并链接微应用包
npm run bootstrap

# 进入子应用进行构建
cd packages/vue-app
npm run build
```

将构建后的产物 `vue-app/dist/vue-app.umd.js` 放入对应的演示项目中。