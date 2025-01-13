import { createApp } from "vue";
import App from "./App.vue";
let app;

if (!window.__POWERED_BY_FRAMEWORK__) {
  app = createApp(App);
  app.mount("#app");
}

export async function bootstrap() {}

export async function mount(props) {
  props.onGlobalStateChange((state) => {
    // 不接收自己发送的消息
    if (state.origin === "vue-app") return;
    console.log("[Vue 子应用] 监听触发：", state);
  });
  // 如果希望子应用在挂载时发送消息给主应用，可以在 mount 方法中调用 setGlobalState 方法
  // props.setGlobalState({
  //   message: "这是一条 Vue 子应用发送的消息，Vue 子应用的 mount 方法被调用。",
  //   origin: "vue-app",
  // });

  app = createApp(App);
  app.mount(props.container.querySelector("#app"));
}

export async function unmount() {
  app && app.unmount();
}
