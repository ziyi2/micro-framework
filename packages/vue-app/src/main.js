import { createApp } from "vue";
import App from "./App.vue";
let app;

import(/* webpackChunkName: "about" */ "./about.js").then((res) => {
  console.log(res);
});

// 判断是否在 qiankun 的环境中运行
// 如果不是，那么说明不在微前端的环境中，可以独立启动
if (!window.__POWERED_BY_QIANKUN__) {
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
  // qiankun 在注册 vue 子应用时会通过 props 传递 microContainer 微应用 DOM 容器元素 ID
  app.mount(`#${props.microContainer}`);
}

export async function unmount(props) {
  console.log("[Vue 子应用] unmount excuted, props: ", props);
  app && app.unmount();
}
