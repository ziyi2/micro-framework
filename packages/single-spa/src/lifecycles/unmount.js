import {
  UNMOUNTING,
  NOT_MOUNTED,
  MOUNTED,
  SKIP_BECAUSE_BROKEN,
} from "../applications/app.helpers.js";
import { handleAppError, transformErr } from "../applications/app-errors.js";
import { reasonableTime } from "../applications/timeouts.js";

export function toUnmountPromise(appOrParcel, hardFail) {
  console.log(
    "[lifecycles/unmount.js - toUnmountPromise]: 开始执行 toUnmountPromise 函数..."
  );

  // 开启微任务，异步执行微应用的卸载函数
  return Promise.resolve().then(() => {
    console.log(
      "[lifecycles/unmount.js - toUnmountPromise]: toUnmountPromise Promise.resolve 开始执行...",
      appOrParcel.name,
      appOrParcel.status
    );

    // 如果 appOrParcel.status 不是 MOUNTED，直接返回 appOrParcel
    if (appOrParcel.status !== MOUNTED) {
      return appOrParcel;
    }

    // 将 appOrParcel.status 设置为 UNMOUNTING
    appOrParcel.status = UNMOUNTING;

    // 没有涉及到 Parcel 的逻辑，这里暂时不用考虑
    const unmountChildrenParcels = Object.keys(appOrParcel.parcels).map(
      (parcelId) => appOrParcel.parcels[parcelId].unmountThisParcel()
    );

    let parcelError;

    return (
      Promise.all(unmountChildrenParcels)
        // 执行子应用的 unmount 函数
        .then(unmountAppOrParcel, (parcelError) => {
          // There is a parcel unmount error
          return unmountAppOrParcel().then(() => {
            // Unmounting the app/parcel succeeded, but unmounting its children parcels did not
            const parentError = Error(parcelError.message);
            if (hardFail) {
              throw transformErr(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
            } else {
              handleAppError(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
            }
          });
        })
        .then(() => appOrParcel)
    );

    function unmountAppOrParcel() {
      console.log(
        "[lifecycles/unmount.js - toUnmountPromise]: 准备执行子应用的 unmount 周期函数...",
        appOrParcel.name,
        appOrParcel.status
      );

      // We always try to unmount the appOrParcel, even if the children parcels failed to unmount.
      // 执行子应用的 unmount 函数（注意使用 resonableTime 包裹，是为了添加执行的超时逻辑）
      return reasonableTime(appOrParcel, "unmount")
        .then(() => {
          // The appOrParcel needs to stay in a broken status if its children parcels fail to unmount
          if (!parcelError) {
            // 如果子应用的 unmount 函数执行成功，将 appOrParcel.status 设置为 NOT_MOUNTED
            appOrParcel.status = NOT_MOUNTED;
          }

          console.log(
            "[lifecycles/unmount.js - toUnmountPromise]: 子应用的 unmount 周期函数执行成功",
            appOrParcel.name,
            appOrParcel.status
          );
        })
        .catch((err) => {
          if (hardFail) {
            throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
          } else {
            handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
          }
        });
    }
  });
}
