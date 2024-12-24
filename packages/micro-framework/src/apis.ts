import { registerApplication, start as startSingleSpa } from "single-spa";
import { importHtmlEntry } from "./app";
import { IRegisterApp, ObjectType } from "./interfaces";

const microApps: Array<IRegisterApp<ObjectType>> = [];

export function start() {
  startSingleSpa();
}

export function registerMicroApps<T extends ObjectType>(
  apps: IRegisterApp<T>[]
) {
  // 防止重复注册
  const unregisteredApps = apps.filter(
    (app) => !microApps.some((registeredApp) => registeredApp.name === app.name)
  );

  // 将未注册的应用推入数组
  microApps.push(...unregisteredApps);

  // 遍历注册应用，调用 single-spa 的 registerApplication 方法进行注册处理
  unregisteredApps.forEach((app) => {
    const { name, activeWhen, props } = app;
    registerApplication({
      name,
      // single-spa 的 app 参数会被 entry 进行封装处理，内部会调用 import-html-entry 进行 HTML 资源解析
      // 注意 single-spa 的 app 参数是一个异步函数，并且需要返回一个符合 single-spa 标准的生命周期对象
      app: async () => await importHtmlEntry(app),
      activeWhen,
      customProps: props,
    });
  });
}
