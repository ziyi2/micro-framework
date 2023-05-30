# iframe 同源隔离

``` bash
# 启动主应用服务
npm run main
# 启动微应用服务
npm run micro
```

启动之后访问主应用地址


## 测试 Web 框架

如果想要测试 Vue 或者 React 框架是否可以在隔离的 iframe 中生效，可以使用 [test/iframe-sandbox-micro-app](https://github.com/ziyi2/micro-framework/tree/test/iframe-sandbox-micro-app) 分支进行代码的修改和构建，构建后将 UMD 规范的产物放入 `public/micro` 目录的 `micro1.js` 中进行测试。