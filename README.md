# NPM 微前端示例


``` bash
# 安装 Lerna 工具
npm install --global lerna

# 依赖安装并链接微应用包
lerna bootstrap

# 进入子应用进行构建
cd packages/vue-app
npm run build
cd packages/react-app
npm run build

# 进入主应用启动
cd packages/main-app
npm start
```