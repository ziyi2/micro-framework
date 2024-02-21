import { createApp } from "vue";
import App from "./App.vue";
let app;

// 判断是否在 single-spa 的环境中运行
// 如果不是，那么说明不在微前端的环境中，可以独立启动
if (!window.singleSpaNavigate) {
  app = createApp(App);
  app.mount("#app");
}

// 注意这里的每一个生命周期函数必须是 async 函数
export async function bootstrap() {
  console.log("[Vue 子应用] bootstrap excuted");
}

export async function mount(props) {
  console.log("[Vue 子应用] mount excuted, props: ", props);
  app = createApp(App);
  app.mount(`#${props.container}`);
}

export async function unmount(props) {
  console.log("[Vue 子应用] unmount excuted, props: ", props);
  app && app.unmount();
}
