# NPM 微前端示例


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
