import { start, registerMicroApps, IRegisterApp } from "micro-framework";
import { initGlobalState, MicroAppStateActions } from "micro-framework";

// 初始化 state
const actions: MicroAppStateActions = initGlobalState({
  message: "",
  origin: "master",
});

actions.onGlobalStateChange((state) => {
  // 不接收自己发送的消息
  if (state.origin === "master") return;
  console.log("[主应用] 监听触发", state);
});

// 此时子应用还没有挂载，所以这条消息会被丢弃
actions.setGlobalState({
  message: "这是一条主应用发送给子应用的消息，会被丢弃",
  origin: "master",
});

window.addEventListener("single-spa:app-change", (event) => {
  actions.setGlobalState({
    message: "这是一条主应用发送给子应用的消息",
    origin: "master",
  });
});

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
