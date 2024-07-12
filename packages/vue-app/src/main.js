import { createApp } from "vue";
import App from "./App.vue";
let app;

import(/* webpackChunkName: "about" */ "./about.js").then((res) => {
  console.log(res);
});

if (!window.__POWERED_BY_QIANKUN__) {
  app = createApp(App);
  app.mount("#app");
}

export async function bootstrap() {
  console.log("[Vue 子应用] bootstrap excuted");
}

export async function mount(props) {
  console.log("[Vue 子应用] mount excuted, props: ", props);
  app = createApp(App);
  // qiankun 在注册 vue 子应用时会通过 props 传递 container
  // Vue CLI 生成的项目中应用的挂载节点是 #app（可以查看 public/index.html）
  // 由于微应用的 HTML 内容会挂载在 container 上
  // 因此可以从 container 中获取到 #app 节点挂载 Vue 应用
  app.mount(props.container.querySelector("#app"));
}

export async function unmount(props) {
  console.log("[Vue 子应用] unmount excuted, props: ", props);
  app && app.unmount();
}
