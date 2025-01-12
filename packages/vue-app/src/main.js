import { createApp } from "vue";
import App from "./App.vue";
let app;

if (!window.__POWERED_BY_FRAMEWORK__) {
  app = createApp(App);
  app.mount("#app");
}

export async function bootstrap() {
  // console.log("[Vue 子应用] bootstrap excuted");
}

export async function mount(props) {
  props.onGlobalStateChange((state) => {
    // 不接收自己发送的消息
    if (state.origin === "vue-app") return;
    console.log("[Vue 子应用] 监听触发：", state);
  });
  props.setGlobalState({
    message: "这是一条 Vue 子应用发送的消息，Vue 子应用的 mount 方法被调用。",
    origin: "vue-app",
  });

  app = createApp(App);
  // micro-framework 在注册 vue 子应用时会通过 props 传递 container
  // Vue CLI 生成的项目中应用的挂载节点是 #app（可以查看 public/index.html）
  // 因此可以从 container 中获取到 #app 节点挂载 Vue 应用
  app.mount(props.container.querySelector("#app"));
}

export async function unmount() {
  // console.log("[Vue 子应用] unmount excuted, props: ", props);
  app && app.unmount();
}
