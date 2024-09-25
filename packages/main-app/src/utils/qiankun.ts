import { start, registerMicroApps, RegistrableApp } from "qiankun";

export function registerQiankunMicroApps(
  microApps: RegistrableApp<{ microContainer: string }>[]
) {
  registerMicroApps(microApps);
  start({
    sandbox: {
      // 开启 Shadow DOM 沙箱
      // strictStyleIsolation: true,
      // 开启 Scoped CSS 沙箱
      experimentalStyleIsolation: true,
    },
  });
}
