import { importEntry } from "import-html-entry";
import {
  getHtmlContent,
  createElement,
  getElementRender,
  getAppLifecycle,
} from "./utils";
import { IRegisterApp, AppLifecycle } from "./interfaces";
import { AppProps } from "single-spa";

export async function importHtmlEntry(app: IRegisterApp) {
  const { entry, container, name } = app;
  // Fetch 请求和解析微应用的 HTML
  const { template, getExternalScripts, execScripts } = await importEntry(
    entry
  );
  // Fetch 请求微应用的 JavaScript 脚本
  await getExternalScripts();
  // 包装微应用的 HTML 内容，添加容器元素和框架的 head 标签（framework-head）
  const appContent = getHtmlContent(app.name, template);
  // 将包装后的 HTML 内容转化为 DOM 对象
  const appElement = createElement(appContent);
  // 寻找需要挂载微应用的容器元素，并将微应用的 DOM 对象挂载到容器元素上
  const render = getElementRender();
  render(appElement, container);
  // 设置框架的标识，微应用可以根据这个标识判断当前是否在框架中运行
  // 注意需要在微应用的 JavaScript 脚本执行之前设置，否则可能会出现判断失误
  window.__POWERED_BY_FRAMEWORK__ = true;
  // 执行微应用的 JavaScript 脚本，获取微应用的导出对象信息
  const appExports = await execScripts<AppLifecycle>();
  // 校验微应用的导出对象是否符合规范
  const appLifecycle = getAppLifecycle(appExports, name);

  return {
    name,
    bootstrap: appLifecycle.bootstrap,
    mount: async (props: AppProps) => {
      window.__POWERED_BY_FRAMEWORK__ = true;
      // 重新将微应用的 DOM 对象（HTML 模板内容）挂载到容器元素上，防止微应用在卸载后重新挂载时出现问题
      render(appElement, container);
      // 执行微应用的挂载函数
      // INFO: 这里传递给微应用的 container 和微应用本身挂载的 container 是两码事
      // 相对于微应用而言，container 是微应用本身所在的 DOM 元素，即 appElement
      await appLifecycle.mount({ ...props, container: appElement });
    },
    unmount: async (props: AppProps) => {
      delete window.__POWERED_BY_FRAMEWORK__;
      // 执行微应用的卸载函数，将微应用的内容从 HTML 模板内容中移除
      await appLifecycle.unmount({ ...props, container: appElement });
      // 移除微应用的 DOM 对象（HTML 模板内容）
      render(null, container);
    },
  };
}
