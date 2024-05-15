import { start, registerMicroApps, RegistrableApp } from "qiankun";

export function registerQiankunMicroApps(
  microApps: RegistrableApp<{ microContainer: string }>[]
) {
  registerMicroApps(microApps);
  start();
}
