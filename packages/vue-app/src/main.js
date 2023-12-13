import { createApp } from "vue";
import App from "./App.vue";
let app;

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export function bootstrap() {
  console.log("[Vue 子应用] bootstrap excuted");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export function mount(props) {
  console.log("[Vue 子应用] mount excuted, props: ", props);
  app = createApp(App);
  app.mount(`#${props.container}`);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export function unmount(props) {
  console.log("[Vue 子应用] unmount excuted, props: ", props);
  app && app.unmount();
}