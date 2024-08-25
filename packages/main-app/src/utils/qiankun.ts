import { start, registerMicroApps, RegistrableApp } from "qiankun";

export function registerQiankunMicroApps(
  microApps: RegistrableApp<{ microContainer: string }>[]
) {
  registerMicroApps(microApps);
  // start({
  //   sandbox: {
  //     // 开启 Shadow DOM 沙箱
  //     // strictStyleIsolation: true,
  //     // 增加一个特殊的选择器规则来限定其影响范围
  //     experimentalStyleIsolation: true,
  //   },
  // });
  start({
    sandbox: false,
  });
}
