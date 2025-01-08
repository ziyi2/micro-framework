import { importEntry } from "import-html-entry";
import {
  getHtmlContent,
  createElement,
  getElementRender,
  getAppLifecycle,
} from "./utils";
import {
  IRegisterApp,
  AppLifecycle,
  FrameworkConfiguration,
} from "./interfaces";
import { cachedGlobals } from "./sandbox/globals";
import { AppProps } from "single-spa";
import { Sandbox } from "./sandbox";

export async function importHtmlEntry(
  app: IRegisterApp,
  frameworkConfiguration: FrameworkConfiguration
) {
  const { entry, container, name } = app;
  const { template, getExternalScripts, execScripts } = await importEntry(
    entry
  );
  await getExternalScripts();
  const appContent = getHtmlContent(app.name, template);
  const appElement = createElement(appContent);
  const render = getElementRender();
  render(appElement, container);
  window.__POWERED_BY_FRAMEWORK__ = true;

  // 在微应用的 JS 代码执行之前, 进行 JS 沙箱实例的初始化
  const sandbox = new Sandbox(name, window, frameworkConfiguration.sandbox);
  // 用沙箱的代理对象作为接下来使用的全局对象
  const global = sandbox.proxy as typeof window;

  // 使用沙箱的代理对象作为全局对象, 执行微应用的 JS 代码（这里已经开启了沙箱模式）
  const appExports = await execScripts<AppLifecycle>(global, true, {
    scopedGlobalVariables: cachedGlobals,
  });
  const appLifecycle = getAppLifecycle(
    appExports,
    name,
    global,
    sandbox?.latestSetProp
  );

  return {
    name,
    bootstrap: appLifecycle.bootstrap,
    mount: async (props: AppProps) => {
      window.__POWERED_BY_FRAMEWORK__ = true;
      render(appElement, container);
      // 激活沙箱
      sandbox.mount();
      await appLifecycle.mount({ ...props, container: appElement });
    },
    unmount: async (props: AppProps) => {
      delete window.__POWERED_BY_FRAMEWORK__;
      await appLifecycle.unmount({ ...props, container: appElement });
      // 卸载沙箱
      sandbox.unmount();
      render(null, container);
    },
  };
}
