import { start, registerMicroApps, IRegisterApp } from "micro-framework";
import { initGlobalState, MicroAppStateActions } from "micro-framework";

// 初始化 state
const actions: MicroAppStateActions = initGlobalState({
  message: "",
  origin: "master",
});

// 如果希望微应用发送消息给主应用，也可以在主应用中监听
// actions.onGlobalStateChange((state) => {
//   // 不接收自己发送的消息
//   if (state.origin === "master") return;
//   console.log("[主应用] 监听触发", state);
// });

// 此时子应用还没有挂载，所以这条消息会被丢弃
actions.setGlobalState({
  message: "这是一条主应用发送给子应用的消息，会被丢弃",
  origin: "master",
});

// 当微应用激活后，主应用发送消息给微应用
window.addEventListener("single-spa:app-change", (event) => {
  actions.setGlobalState({
    message: "这是一条主应用发送给子应用的消息",
    origin: "master",
  });
});

export function registerFrameworkMicroApps(microApps: IRegisterApp[]) {
  registerMicroApps(microApps);
  start({
    prefetch: "all",
  });
}
