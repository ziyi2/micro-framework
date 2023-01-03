import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

export function mount() {
  console.log('vue-app')
  console.log(document.getElementById('vue-app'))
  app.mount("#vue-app");
}

export function unmount() {
  app.unmount();
}

app.mount("#app");
