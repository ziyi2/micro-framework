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

// 对 single-spa 注册 API 的 app 参数需要的生命周期函数对象进行适配
// 为了使得微应用中导出的周期函数不需要在顶层作用域提供 async
// 需要在主应用中对周期函数进行 async 包装处理
export function getAppLifeCycles(res) {
  let lifeCycles = {};
  Object.keys(res).forEach((key) => {
    const lifecycle = res[key];
    if (lifecycle && typeof lifecycle === "function") {
      // 将子应用的所有 lifeCycle 函数进行包装，包装成 async 函数
      lifeCycles[key] = async (...args) => {
        console.log(`[main-app] ${key} start`);
        await lifecycle(...args);
        console.log(`[main-app] ${key} end`);
      };
    }
  });
  return lifeCycles;
}
