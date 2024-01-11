// 使用 Lerna 执行 lerna bootstrap 之后，本地 packages 中的应用可以通过 NPM 包的方式进行引入
// 注意这里直接引入了开发态的入口文件，而不是打包后的文件
import { start, registerApplication } from "single-spa/src/single-spa";
import { RegisterApplicationConfig } from "single-spa";

// 对 single-spa 的 registerApplication 进行二次封装，使其可以接收一个数组，批量注册微应用
export function registerMicroApps(apps: RegisterApplicationConfig[]) {
  // @ts-ignore
  // 如果不开启 __DEV__，single-spa 无法正常运行
  window.__DEV__ = true;
  apps.forEach(registerApplication);
  start();
}
