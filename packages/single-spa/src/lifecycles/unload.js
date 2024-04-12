import {
  NOT_MOUNTED,
  UNLOADING,
  NOT_LOADED,
  LOAD_ERROR,
  SKIP_BECAUSE_BROKEN,
  toName,
} from "../applications/app.helpers.js";
import { handleAppError } from "../applications/app-errors.js";
import { reasonableTime } from "../applications/timeouts.js";

const appsToUnload = {};

export function toUnloadPromise(app) {
  // 开启微任务，异步执行微应用的去加载函数
  return Promise.resolve().then(() => {
    // 如果外部调用 unloadApplication，那么 appsToUnload 中会有对应的 app 信息
    const unloadInfo = appsToUnload[toName(app)];
    // 如果不存在 unloadInfo，说明外部没有调用 unloadApplication 卸载应用，或者微应用 unloadInfo 发生了变化，直接返回 app
    if (!unloadInfo) {
      /* No one has called unloadApplication for this app,
       */
      return app;
    }

    // 如果 app.status 为 NOT_LOADED，说明 app 从未加载或者已经被卸载了，直接清理掉 app 的状态
    if (app.status === NOT_LOADED) {
      /* This app is already unloaded. We just need to clean up
       * anything that still thinks we need to unload the app.
       */
      finishUnloadingApp(app, unloadInfo);
      return app;
    }

    // 如果 app.status 为 UNLOADING，说明 app 正在卸载中，直接返回 unloadInfo.promise
    if (app.status === UNLOADING) {
      /* Both unloadApplication and reroute want to unload this app.
       * It only needs to be done once, though.
       */
      // 在 unloadApplication 和 reroute 中都会调用 toUnloadPromise，但是只需要执行一次（防止重复执行），所以直接返回 unloadInfo.promise
      return unloadInfo.promise.then(() => app);
    }

    // 如果 app.status 不是 NOT_MOUNTED 和 LOAD_ERROR，则说明 app 没有被 unmount
    // 这里需要等待 app unmount 完成后再执行 app unload 操作
    if (app.status !== NOT_MOUNTED && app.status !== LOAD_ERROR) {
      /* The app cannot be unloaded until it is unmounted.
       */
      return app;
    }

    // 如果 app.status 为 LOAD_ERROR，则说明 app 加载失败，不需要进行 unload 操作
    // 否则需要执行 app unload 操作
    const unloadPromise =
      app.status === LOAD_ERROR
        ? Promise.resolve()
        : // 注意使用 resonableTime 包裹，是为了添加执行的超时逻辑
          reasonableTime(app, "unload");

    // 将 app.status 设置为 UNLOADING，表示 app 正在卸载中
    app.status = UNLOADING;

    return unloadPromise
      .then(() => {
        // 如果 app 的 unload 函数执行成功，清理 app 的状态，删除 app 的生命周期函数，重置 app 的状态
        finishUnloadingApp(app, unloadInfo);
        return app;
      })
      .catch((err) => {
        errorUnloadingApp(app, unloadInfo, err);
        return app;
      });
  });
}

/**
 * @description 清理 app 的状态，删除 app 的生命周期函数，重置 app 的状态
 * @param app 应用
 * @param unloadInfo 微应用卸载信息
 */
function finishUnloadingApp(app, unloadInfo) {
  delete appsToUnload[toName(app)];

  // Unloaded apps don't have lifecycles
  // 删除 app 的生命周期函数
  delete app.bootstrap;
  delete app.mount;
  delete app.unmount;
  delete app.unload;

  // 重置 app 的状态为 NOT_LOADED
  app.status = NOT_LOADED;

  /* resolve the promise of whoever called unloadApplication.
   * This should be done after all other cleanup/bookkeeping
   */
  unloadInfo.resolve();
}

function errorUnloadingApp(app, unloadInfo, err) {
  delete appsToUnload[toName(app)];

  // Unloaded apps don't have lifecycles
  delete app.bootstrap;
  delete app.mount;
  delete app.unmount;
  delete app.unload;

  handleAppError(err, app, SKIP_BECAUSE_BROKEN);
  unloadInfo.reject(err);
}

/**
 * @description 将微应用添加到去加载列表中（外部调用 unloadApplication 时会触发）
 * @export
 * @param app 微应用
 * @param promiseGetter 获取微应用去加载 Promise 的函数
 * @param resolve Promise 的 resolve 函数
 * @param reject Promise 的 reject 函数
 */
export function addAppToUnload(app, promiseGetter, resolve, reject) {
  // 将微应用添加到去加载列表 appsToUnload 中
  appsToUnload[toName(app)] = { app, resolve, reject };
  Object.defineProperty(appsToUnload[toName(app)], "promise", {
    get: promiseGetter,
  });
}

/**
 * @description 获取微应用去加载信息
 * @export
 * @param appName 微应用名称
 * @returns {*} 微应用去加载信息
 */
export function getAppUnloadInfo(appName) {
  return appsToUnload[appName];
}
