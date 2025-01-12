import { start, registerMicroApps, IRegisterApp } from "micro-framework";

export function registerFrameworkMicroApps(microApps: IRegisterApp[]) {
  registerMicroApps(microApps);
  start({
    // prefetch: ["react"],
    prefetch: "all",
    // prefetch: ["react", "vue"],
    // 此时如果激活了某个微应用
    // 微应用的预加载和自定义加载同时触发执行
    // 不会重复加载微应用资源，因为 import-html-entry 会对加载的微应用资源的 fetch Promise 进行了缓存
    // prefetch: "all",
    // prefetch: (apps: IRegisterApp[]) => {
    //   return {
    //     criticalAppNames: ["react"],
    //     minorAppsName: ["vue"],
    //   };
    // },
  });
}
