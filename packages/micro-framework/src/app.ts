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
import { getMicroAppStateActions } from "./globalState";

export async function importHtmlEntry(
  app: IRegisterApp,
  frameworkConfiguration: FrameworkConfiguration
) {
  const { entry, container, name } = app;
  console.log("[Framework] importHtmlEntry", app);
  const { template, getExternalScripts, execScripts } = await importEntry(
    entry
  );
  await getExternalScripts();
  const appContent = getHtmlContent(app.name, template);
  const appElement = createElement(appContent);
  const render = getElementRender();
  render(appElement, container);
  window.__POWERED_BY_FRAMEWORK__ = true;

  const sandbox = new Sandbox(name, window, frameworkConfiguration.sandbox);
  const global = sandbox.proxy as typeof window;
  const appExports = await execScripts<AppLifecycle>(global, true, {
    scopedGlobalVariables: cachedGlobals,
  });
  const appLifecycle = getAppLifecycle(
    appExports,
    name,
    global,
    sandbox?.latestSetProp
  );

  // 获取通信的方法
  const { onGlobalStateChange, setGlobalState, offGlobalStateChange } =
    getMicroAppStateActions(name);

  return {
    name,
    bootstrap: appLifecycle.bootstrap,
    mount: async (props: AppProps) => {
      window.__POWERED_BY_FRAMEWORK__ = true;
      render(appElement, container);
      sandbox.mount();
      await appLifecycle.mount({
        ...props,
        container: appElement,
        // 发布变化
        setGlobalState,
        // 注册监听（可以重复注册，新的注册会覆盖旧的注册）
        onGlobalStateChange,
      });
    },
    unmount: async (props: AppProps) => {
      delete window.__POWERED_BY_FRAMEWORK__;
      await appLifecycle.unmount({ ...props, container: appElement });
      sandbox.unmount();
      render(null, container);
      // 移除监听
      offGlobalStateChange();
    },
  };
}
