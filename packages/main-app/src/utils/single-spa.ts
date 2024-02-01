// 使用 Lerna 执行 lerna bootstrap 之后，本地 packages 中的应用可以通过 NPM 包的方式进行引入
// 注意这里直接引入了开发态的入口文件，而不是打包后的文件
import { start, registerApplication } from "single-spa/src/single-spa";
import { LifeCycles, RegisterApplicationConfig } from "single-spa";
import { getMicroAppLifecycle } from "single-spa-lifecycle";
import { IMicroApp } from "../types";

// 对 single-spa 的 registerApplication 进行二次封装，使其可以接收一个数组，批量注册微应用
export function registerMicroApps(apps: RegisterApplicationConfig[]) {
  // @ts-ignore
  // 如果不开启 __DEV__，single-spa 的源码无法正常运行
  window.__DEV__ = true;
  apps.forEach(registerApplication);
  start();
}

export function loadMicroApp(app: IMicroApp): Promise<LifeCycles> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = app.entry; // 微应用的入口文件
    // 这里的代码是否还有优化的空间？
    // 如何让微应用的生命周期初始化后立马可以在主应用中获取？
    // 例如不需要等待 onload 事件触发
    script.onload = () => {
      resolve(getMicroAppLifecycle(app.name)); // 从全局映射中获取生命周期函数
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
