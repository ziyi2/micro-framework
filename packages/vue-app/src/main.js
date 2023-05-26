import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import HelloFoo from "./HelloFoo.vue";
import HelloBar from "./HelloBar.vue";
let app;

const routes = [
  { path: "/foo", component: HelloFoo },
  { path: "/bar", component: HelloBar },
];

const router = createRouter({
  // history 模式
  // history: createWebHistory()
  // hash 模式
  history: createWebHashHistory(),
  routes,
});

app = createApp(App);
app.use(router);
app.mount(document.body);

// export function mount() {
//   console.log("vue app mount");
//   app = createApp(App);
//   app.mount("#vue-app");
// }

// export function unmount() {
//   console.log("vue app unmount: ", app);
//   app && app.unmount();
// }
