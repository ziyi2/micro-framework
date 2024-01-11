import { createApp } from "vue";
import App from "./App.vue";
let app;

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
