import isFunction from "lodash/isFunction";
import { AppLifecycle } from "./interfaces";

export const frameworkHeadTagName = "framework-head";

// 获取微应用的 HTML 内容
export function getHtmlContent(appName: string, template: string): string {
  let appContent = template;

  // 将微应用的 head 标签替换为微前端框架的 head 标签
  // 如果存在 head 标签，则替换，否则在已有的 HTML 模板前添加微前端框架的 head 标签
  if (template.includes("<head>")) {
    appContent = appContent
      .replace("<head>", `<${frameworkHeadTagName}>`)
      .replace("</head>", `</${frameworkHeadTagName}>`);
  } else {
    appContent = `<${frameworkHeadTagName}></${frameworkHeadTagName}>${appContent}`;
  }

  // 给微应用的 HTML 添加一个容器元素，用于挂载微应用
  // 在容器元素上添加微应用的标识和版本信息
  return `<div data-framework-app="${appName}">${appContent}</div>`;
}

// 将 HTML 字符串转化为 DOM 对象
export function createElement(appContent: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = appContent;
  return container.firstChild as HTMLElement;
}

// 返回一个函数，用于将微应用的 DOM 对象挂载到容器元素上
export function getElementRender() {
  return (
    appElement: HTMLElement | null,
    appContainer: string | HTMLElement
  ) => {
    const container = getContainerElement(appContainer);
    if (!container) {
      throw new Error(`Container ${appContainer?.toString()} not found`);
    }
    // 如果容器元素存在且不包含微应用的 DOM 对象，则将微应用的 DOM 对象挂载到容器元素上
    if (container && !container.contains(appElement)) {
      while (container?.firstChild) {
        container.removeChild(container.firstChild);
      }
      // 如果传入的 DOM 对象为 null, 则只是清空容器元素，不进行挂载操作
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

// TODO: globalLatestSetProp 识别
export function getAppLifecycle<T>(appExports: AppLifecycle, name: string) {
  // 获取微应用的生命周期函数
  const { bootstrap, mount, unmount } = appExports;

  // 强制框架传入的生命周期函数必须为函数（single-spa 还支持传递数组）
  if (!isFunction(bootstrap) || !isFunction(mount) || !isFunction(unmount)) {
    throw new Error(
      `[framework] The micro app ${name} must export the lifecycle functions`
    );
  }

  return appExports;
}
