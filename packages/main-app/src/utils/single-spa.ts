// 注意这里直接引入了开发态的入口文件，而不是打包后的文件
import { start, registerApplication } from "single-spa/src/single-spa";
import { RegisterApplicationConfig } from "single-spa";

// 对 single-spa 的 registerApplication 进行二次封装，使其可以接收一个数组，批量注册子应用
export function registerMicroApps(apps: RegisterApplicationConfig[]) {
  // @ts-ignore
  // 如果不开启 __DEV__，single-spa 无法正常运行
  window.__DEV__ = true;
  apps.forEach(registerApplication);
  start();
}

export function getAppLifeCycles(res) {
  let lifeCycles = {};
  Object.keys(res).forEach((key) => {
    const lifecycle = res[key];
    if (lifecycle && typeof lifecycle === "function") {
      // 将子应用的所有 lifeCycle 函数进行包装，包装成返回 Promise 的
      lifeCycles[key] = async (...args) => {
        console.log(`[main-app] ${key} start`);
        await lifecycle(...args);
        console.log(`[main-app] ${key} end`);
      };
    }
  });
  return lifeCycles;
}
