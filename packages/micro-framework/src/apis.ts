import { registerApplication, start as startSingleSpa } from "single-spa";
import { importHtmlEntry } from "./app";
import { FrameworkConfiguration, IRegisterApp, ObjectType } from "./interfaces";
import { doPrefetchStrategy } from "./prefetch";

const microApps: Array<IRegisterApp<ObjectType>> = [];
let frameworkConfiguration = {};

export function start(
  opts: FrameworkConfiguration = { prefetch: true, sandbox: true }
) {
  frameworkConfiguration = opts;

  // 如果存在预加载配置
  if (opts.prefetch) {
    // 执行预加载策略
    doPrefetchStrategy(microApps, opts.prefetch);
  }

  startSingleSpa();
}

export function registerMicroApps<T extends ObjectType>(
  apps: IRegisterApp<T>[]
) {
  const unregisteredApps = apps.filter(
    (app) => !microApps.some((registeredApp) => registeredApp.name === app.name)
  );

  microApps.push(...unregisteredApps);

  unregisteredApps.forEach((app) => {
    const { name, activeWhen, props } = app;
    registerApplication({
      name,
      app: async () => await importHtmlEntry(app, frameworkConfiguration),
      activeWhen,
      customProps: props,
    });
  });
}
