import {
  NOT_BOOTSTRAPPED,
  BOOTSTRAPPING,
  NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN,
} from "../applications/app.helpers.js";
import { reasonableTime } from "../applications/timeouts.js";
import { handleAppError, transformErr } from "../applications/app-errors.js";

export function toBootstrapPromise(appOrParcel, hardFail) {
  console.log(
    "[lifecycles/bootstrap.js - toBootstrapPromise]: toBootstrapPromise 函数开始执行...",
    appOrParcel.name,
    appOrParcel.status
  );
  // 开启微任务，异步执行微应用的加载函数
  return Promise.resolve().then(() => {
    console.log(
      "[lifecycles/bootstrap.js - toBootstrapPromise]: toBootstrapPromise Promise.resolve 开始执行...",
      appOrParcel.name,
      appOrParcel.status
    );

    // 如果 appOrParcel.status 不是 NOT_BOOTSTRAPPED，直接返回 appOrParcel
    if (appOrParcel.status !== NOT_BOOTSTRAPPED) {
      return appOrParcel;
    }

    // 将 appOrParcel.status 设置为 BOOTSTRAPPING
    appOrParcel.status = BOOTSTRAPPING;

    if (!appOrParcel.bootstrap) {
      // Default implementation of bootstrap
      return Promise.resolve().then(successfulBootstrap);
    }

    console.log(
      "[lifecycles/bootstrap.js - toBootstrapPromise]: 准备执行子应用的 bootstrap 周期函数...",
      appOrParcel.name,
      appOrParcel.status
    );
    // 执行子应用的 bootstrap 函数（注意使用 resonableTime 包裹，是为了添加执行的超时逻辑）
    return reasonableTime(appOrParcel, "bootstrap")
      .then(successfulBootstrap)
      .catch((err) => {
        if (hardFail) {
          throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
        } else {
          handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
          return appOrParcel;
        }
      });
  });

  function successfulBootstrap() {
    // boostrap 生命周期函数执行成功, 将 appOrParcel.status 设置为 NOT_MOUNTED
    appOrParcel.status = NOT_MOUNTED;
    console.log(
      "[lifecycles/bootstrap.js - toBootstrapPromise]: 子应用的 bootstrap 周期函数执行成功",
      appOrParcel.name,
      appOrParcel.status
    );
    return appOrParcel;
  }
}
