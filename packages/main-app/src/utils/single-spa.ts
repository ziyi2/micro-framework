// single-spa 使用 NPM 库包
import {
  start,
  registerApplication,
  LifeCycles,
  RegisterApplicationConfig,
  AppProps,
} from "single-spa";

import { importEntry } from "import-html-entry";
import { MICRO_APP_CONTAINER_ID } from "./micros";

// 对 single-spa 的 registerApplication 进行二次封装，使其可以接收一个数组，批量注册子应用
export function registerMicroApps(apps: RegisterApplicationConfig[]) {
  apps.forEach(registerApplication);
  start();
}

export async function fetchApp(url: string): Promise<LifeCycles> {
  // import-html-entry 根据 URL 获取微应用的 HTML 模板、外部脚本、CSS、生命周期函数等
  const { template, execScripts, getExternalScripts } = await importEntry(url);
  console.log("template", template);
  await getExternalScripts();
  // 将 HTML 挂载到 container 容器中
  const container = document.getElementById(MICRO_APP_CONTAINER_ID)!;
  container.innerHTML = template;
  // import-html-entry 自动识别微应用导出的生命周期函数
  const scriptExports: LifeCycles = await execScripts();
  return {
    async bootstrap(props) {
      console.log("bootstrap", props);
      await execLifecycleFn(scriptExports, "bootstrap", props);
    },
    async mount(props) {
      const container = document.getElementById(MICRO_APP_CONTAINER_ID)!;
      container.innerHTML = template;
      await execLifecycleFn(scriptExports, "mount", props);
    },
    async unmount(props) {
      const container = document.getElementById(MICRO_APP_CONTAINER_ID)!;
      await execLifecycleFn(scriptExports, "unmount", props);
      container.innerHTML = "";
    },
  };
}

export async function execLifecycleFn(
  scriptExports: LifeCycles,
  lifecycle: keyof LifeCycles,
  props: AppProps
) {
  const lifecycleFn = scriptExports[lifecycle];
  if (Array.isArray(lifecycleFn)) {
    // 如果是数组，需要按顺序执行
    for (const fn of lifecycleFn) {
      await fn(props);
    }
  } else if (lifecycleFn) {
    await lifecycleFn(props);
  }
}
