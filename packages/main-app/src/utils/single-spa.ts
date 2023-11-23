// 这里使用 npm link 进行连接调试
import { start, registerApplication } from "single-spa/src/single-spa";
import { RegisterApplicationConfig } from "single-spa";

// 对 single-spa 的 registerApplication 进行二次封装，使其可以接收一个数组，批量注册子应用
export function registerMicroApps(apps: RegisterApplicationConfig[]) {
  apps.forEach(registerApplication)
  // apps.forEach((item) => {
  //   let { name, activeWhen, customProps } = item;
  //   // single-spa 提供了两种调用方式：registerApplication({ name, app, activeWhen, customProps }) 和 registerApplication(name, app, activeWhen, customProps)
  //   // 详见 https://single-spa.js.org/docs/configuration#registering-applications
  //   registerApplication({
  //     name,
  //     // app 参数可以是一个对象，也可以是一个函数

  //     // 如果 app 参数是对象，那么对象其实是一个包含了生命周期函数的对象，例如：{ bootstrap: async () => {}, mount, unmount }
  //     // 详见 https://single-spa.js.org/docs/configuration#application-as-second-argument

  //     // 如果 app 参数是函数，那么函数的返回值是一个包含了生命周期函数的对象，例如：() => Promise.resolve({ bootstrap: async () => {}, mount, unmount })
  //     // 详见 https://single-spa.js.org/docs/configuration/#activity-function

  //     // 可以查看 TypeScript 定义
  //     app: item.app,
  //     activeWhen,
  //     customProps,
  //   });
  // });
  start();
}

// app 的定义如下所示：
// export type AppProps = {
//   name: string;
//   singleSpa: any;
// };

// type LifeCycleFn<ExtraProps> = (config: ExtraProps & AppProps) => Promise<any>;
// export type LifeCycles<ExtraProps = {}> = {
//   bootstrap: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
//   mount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
//   unmount: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
//   update?: LifeCycleFn<ExtraProps> | Array<LifeCycleFn<ExtraProps>>;
// };

// // 从上面的定义可以看出，app 可以是一个对象，也可以是一个函数，如果是一个函数，那么函数的返回值是一个对象   
// // 也就是说，app 的类型可以是 LifeCycles<ExtraProps>，也可以是 (config: ExtraProps & AppProps) => Promise<LifeCycles<ExtraProps>>，这两种类型是等价的
// type Application<ExtraProps = {}> =
//   | LifeCycles<ExtraProps>
//   | ((config: ExtraProps & AppProps) => Promise<LifeCycles<ExtraProps>>);


