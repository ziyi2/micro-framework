import {
  NOT_MOUNTED,
  MOUNTED,
  SKIP_BECAUSE_BROKEN,
} from "../applications/app.helpers.js";
import { handleAppError, transformErr } from "../applications/app-errors.js";
import { reasonableTime } from "../applications/timeouts.js";
import CustomEvent from "custom-event";
import { toUnmountPromise } from "./unmount.js";

let beforeFirstMountFired = false;
let firstMountFired = false;

export function toMountPromise(appOrParcel, hardFail) {
  console.log(
    "[lifecycles/mount.js - toMountPromise]: toMountPromise 函数开始执行...",
    appOrParcel.name,
    appOrParcel.status
  );

  // 开启微任务，异步执行微应用的加载函数
  return Promise.resolve().then(() => {
    console.log(
      "[lifecycles/mount.js - toMountPromise]: toMountPromise Promise.resolve 开始执行...",
      appOrParcel.name,
      appOrParcel.status
    );

    // 如果 appOrParcel.status 不是 NOT_MOUNTED，直接返回 appOrParcel
    if (appOrParcel.status !== NOT_MOUNTED) {
      return appOrParcel;
    }

    // 如果是第一次挂载子应用，触发 single-spa:before-first-mount 事件
    if (!beforeFirstMountFired) {
      window.dispatchEvent(new CustomEvent("single-spa:before-first-mount"));
      beforeFirstMountFired = true;
    }

    console.log(
      "[lifecycles/mount.js - toMountPromise]: 准备执行子应用的 mount 周期函数...",
      appOrParcel.name,
      appOrParcel.status
    );

    // 触发子应用的 mount 函数（注意使用 resonableTime 包裹，是为了添加执行的超时逻辑）
    return reasonableTime(appOrParcel, "mount")
      .then(() => {
        // mount 生命周期函数执行成功, 将 appOrParcel.status 设置为 MOUNTED
        appOrParcel.status = MOUNTED;

        // 如果是第一次挂载子应用，触发 single-spa:first-mount 事件
        if (!firstMountFired) {
          window.dispatchEvent(new CustomEvent("single-spa:first-mount"));
          firstMountFired = true;
        }
        console.log(
          "[lifecycles/mount.js - toMountPromise]: 子应用的 mount 周期函数执行成功",
          appOrParcel.name,
          appOrParcel.status
        );

        return appOrParcel;
      })
      .catch((err) => {
        // If we fail to mount the appOrParcel, we should attempt to unmount it before putting in SKIP_BECAUSE_BROKEN
        // We temporarily put the appOrParcel into MOUNTED status so that toUnmountPromise actually attempts to unmount it
        // instead of just doing a no-op.
        appOrParcel.status = MOUNTED;
        return toUnmountPromise(appOrParcel, true).then(
          setSkipBecauseBroken,
          setSkipBecauseBroken
        );

        function setSkipBecauseBroken() {
          if (!hardFail) {
            handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
            return appOrParcel;
          } else {
            throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
          }
        }
      });
  });
}
