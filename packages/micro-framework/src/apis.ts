import { registerApplication, start as startSingleSpa } from "single-spa";
import { importHtmlEntry } from "./app";
import { FrameworkConfiguration, IRegisterApp, ObjectType } from "./interfaces";

const microApps: Array<IRegisterApp<ObjectType>> = [];
let frameworkConfiguration = {};

export function start(opts: FrameworkConfiguration = {}) {
  frameworkConfiguration = opts;
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
