import { createApp } from "vue";
import App from "./App.vue";
let app;

export function mount(containerId) {
  console.log("vue app mount");
  app = createApp(App);
  app.mount(`#${containerId}`);
}

export function unmount() {
  console.log("vue app unmount: ", app);
  app && app.unmount();
}

