import isFunction from "lodash/isFunction";
import { AppLifecycle } from "./interfaces";

export const frameworkHeadTagName = "framework-head";

export function getHtmlContent(appName: string, template: string): string {
  let appContent = template;
  if (template.includes("<head>")) {
    appContent = appContent
      .replace("<head>", `<${frameworkHeadTagName}>`)
      .replace("</head>", `</${frameworkHeadTagName}>`);
  } else {
    appContent = `<${frameworkHeadTagName}></${frameworkHeadTagName}>${appContent}`;
  }
  return `<div data-framework-app="${appName}">${appContent}</div>`;
}

export function createElement(appContent: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = appContent;
  return container.firstChild as HTMLElement;
}

export function getElementRender() {
  return (
    appElement: HTMLElement | null,
    appContainer: string | HTMLElement
  ) => {
    const container = getContainerElement(appContainer);
    if (!container) {
      throw new Error(`Container ${appContainer?.toString()} not found`);
    }
    if (container && !container.contains(appElement)) {
      while (container?.firstChild) {
        container.removeChild(container.firstChild);
      }
      if (appElement) {
        container.appendChild(appElement);
      }
    }
  };
}

export function getContainerElement(container: string | HTMLElement) {
  return typeof container === "string"
    ? document.querySelector(container)
    : container;
}

/** 校验子应用导出的 生命周期 对象是否正确 */
export function validateExportLifecycle(exports: any) {
  const { bootstrap, mount, unmount } = exports ?? {};
  return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
}

export function getAppLifecycle<T>(
  appExports: AppLifecycle,
  appName: string,
  global: typeof window,
  globalLatestSetProp: PropertyKey | null
) {
  if (validateExportLifecycle(appExports)) {
    return appExports;
  }

  if (process.env.NODE_ENV === "development") {
    console.error(
      `[Framework] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`
    );
  }
  // fallback to sandbox latest set property if it had
  // 如果 scriptExports 不符合生命周期函数的格式，则尝试从最后一个设置的 window 属性中获取
  // 无沙箱模式下，globalLatestSetProp 为 undefined
  if (globalLatestSetProp) {
    const lifecycles = (<any>global)[globalLatestSetProp];
    if (validateExportLifecycle(lifecycles)) {
      return lifecycles;
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[Framework] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`
    );
  }

  // fallback to global variable who named with ${appName} while module exports not found
  // 如果 scriptExports 不符合生命周期函数的格式，则尝试从 window[appName] 中获取
  const globalVariableExports = (global as any)[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new Error(
    `[Framework] You need to export lifecycle functions in ${appName} entry`
  );
}
