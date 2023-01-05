import { createApp } from "vue";
import App from "./App.vue";
let app;

export function mount() {
  console.log("vue app mount");
  app = createApp(App);
  app.mount("#vue-app");
}

export function unmount() {
  console.log("vue app unmount: ", app);
  app && app.unmount();
}

