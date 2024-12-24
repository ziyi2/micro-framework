import { start, registerMicroApps, IRegisterApp } from "micro-framework";

export function registerFrameworkMicroApps(microApps: IRegisterApp[]) {
  registerMicroApps(microApps);
  start();
}
