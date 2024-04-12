import {
  LOAD_ERROR,
  NOT_BOOTSTRAPPED,
  LOADING_SOURCE_CODE,
  SKIP_BECAUSE_BROKEN,
  NOT_LOADED,
  objectType,
  toName,
} from "../applications/app.helpers.js";
import { ensureValidAppTimeouts } from "../applications/timeouts.js";
import {
  handleAppError,
  formatErrorMessage,
} from "../applications/app-errors.js";
import {
  flattenFnArray,
  smellsLikeAPromise,
  validLifecycleFn,
} from "./lifecycle.helpers.js";
import { getProps } from "./prop.helpers.js";
import { assign } from "../utils/assign.js";

export function toLoadPromise(app) {
  console.log(
    "[lifecycles/load.js - toLoadPromise]: toLoadPromise 函数开始执行...",
    app.name,
    app.status
  );

  // 开启微任务，异步执行微应用的加载函数
  return Promise.resolve().then(() => {
    console.log(
      "[lifecycles/load.js - toLoadPromise]: toLoadPromise Promise.resolve 开始执行, 开始检测 app.loadPromise 是否已经执行过。",
      app.name,
      app.status
    );

    // 如果 app.loadPromise 存在，直接返回 app.loadPromise
    // 这里可以确保同一个 app 只会执行一次 loadApp 方法

    // 例如注册微应用时会调用 loadApps 方法，会执行微应用的 toLoadPromise，此时会缓存 app.loadPromise
    // 而启动 start 函数最终调用 performAppChanges 时还会执行微应用的 toLoadPromise
    // 为了避免重复执行 app.loadPromise 方法，这里会直接返回 app.loadPromise（Promise 对象）
    if (app.loadPromise) {
      console.log(
        "[lifecycles/load.js - toLoadPromise]: 已经执行过 app.loadPromise，直接返回对应的 Promise 结果。",
        app.name,
        app.status
      );
      return app.loadPromise;
    }

    // 如果 app.status 不是 NOT_LOADED 和 LOAD_ERROR，直接返回 app
    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
      return app;
    }

    // 将 app.status 设置为 LOADING_SOURCE_CODE
    app.status = LOADING_SOURCE_CODE;

    let appOpts, isUserErr;

    console.log(
      "[lifecycles/load.js - toLoadPromise]: app.loadPromise 开始执行...",
      app.name,
      app.status
    );

    // 使用 app.loadPromise 缓存 app 的加载，避免在 loadApps 以及 performAppChanges 时重复加载
    return (app.loadPromise = Promise.resolve()
      .then(() => {
        console.log(
          "[lifecycles/load.js - toLoadPromise]: 在 Promise.resolve 中开始执行 app.loadPromise...",
          app.name,
          app.status
        );

        console.log(
          "[lifecycles/load.js - toLoadPromise]: 准备执行 app.loadApp（registerApplication 的第二个参数 app）...",
          app.name,
          app.status
        );
        // 这里的 loadApp 其实就是 registerApplication 的第二个参数
        // 在主应用中使用 window.fetch 获取子应用的资源，执行后需要返回 Promise，并且返回的是子应用的生命周期函数对象
        const loadPromise = app.loadApp(getProps(app));
        // 如果 loadPromise 不是 Promise 对象，抛出异常
        if (!smellsLikeAPromise(loadPromise)) {
          // The name of the app will be prepended to this error message inside of the handleAppError function
          // app.loadApp 返回的不是 Promise 对象，抛出异常
          isUserErr = true;
          throw Error(
            formatErrorMessage(
              33,
              __DEV__ &&
                `single-spa loading function did not return a promise. Check the second argument to registerApplication('${toName(
                  app
                )}', loadingFunction, activityFunction)`,
              toName(app)
            )
          );
        }

        // 这里的 val 其实就是 loadApp 的 Promise 返回值
        // 也就是 registerApplication 的第二个参数 app 的返回值
        // 例如：() => import("react-micro-app")，返回的是一个 Promise
        // 例如：() => Promise.resolve({ bootstrap: async () => {}, mount, unmount })，返回的是一个 Promise
        // 所以 val 就是各个子应用的生命周期函数组成的对象，例如：{ bootstrap: async () => {}, mount, unmount }
        return loadPromise.then((val) => {
          console.log(
            "[lifecycles/load.js - toLoadPromise]: app.loadApp 执行完成，开始检测子应用的生命周期函数是否符合要求...",
            app.name,
            app.status
          );

          app.loadErrorTime = null;

          appOpts = val;

          let validationErrMessage, validationErrCode;

          if (typeof appOpts !== "object") {
            validationErrCode = 34;
            if (__DEV__) {
              validationErrMessage = `does not export anything`;
            }
          }

          // 判断 appOpts 的 bootstrap、mount、unmount 是否符合要求
          if (
            // ES Modules don't have the Object prototype
            // ES 模块没有 Object 原型
            Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") &&
            !validLifecycleFn(appOpts.bootstrap)
          ) {
            validationErrCode = 35;
            if (__DEV__) {
              validationErrMessage = `does not export a valid bootstrap function or array of functions`;
            }
          }

          if (!validLifecycleFn(appOpts.mount)) {
            validationErrCode = 36;
            if (__DEV__) {
              validationErrMessage = `does not export a mount function or array of functions`;
            }
          }

          if (!validLifecycleFn(appOpts.unmount)) {
            validationErrCode = 37;
            if (__DEV__) {
              validationErrMessage = `does not export a unmount function or array of functions`;
            }
          }

          const type = objectType(appOpts);

          if (validationErrCode) {
            let appOptsStr;
            try {
              appOptsStr = JSON.stringify(appOpts);
            } catch {}
            console.error(
              formatErrorMessage(
                validationErrCode,
                __DEV__ &&
                  `The loading function for single-spa ${type} '${toName(
                    app
                  )}' resolved with the following, which does not have bootstrap, mount, and unmount functions`,
                type,
                toName(app),
                appOptsStr
              ),
              appOpts
            );
            handleAppError(validationErrMessage, app, SKIP_BECAUSE_BROKEN);
            return app;
          }

          if (appOpts.devtools && appOpts.devtools.overlays) {
            app.devtools.overlays = assign(
              {},
              app.devtools.overlays,
              appOpts.devtools.overlays
            );
          }

          // 设置 app 的状态为 NOT_BOOTSTRAPPED
          app.status = NOT_BOOTSTRAPPED;
          // 将 appOpts 中的周期函数扁平化
          app.bootstrap = flattenFnArray(appOpts, "bootstrap");
          app.mount = flattenFnArray(appOpts, "mount");
          app.unmount = flattenFnArray(appOpts, "unmount");
          app.unload = flattenFnArray(appOpts, "unload");
          app.timeouts = ensureValidAppTimeouts(appOpts.timeouts);

          // 删除 app.loadPromise，表明 app.loadPromise 已经执行完成
          // 下一次执行 toLoadPromise 时会重新执行 app.loadPromise
          delete app.loadPromise;

          console.log(
            "[lifecycles/load.js - toLoadPromise]:  app.loadApp 返回的周期函数解析完成，所有周期函数符合要求。",
            app.name,
            app.status
          );

          return app;
        });
      })
      .catch((err) => {
        delete app.loadPromise;

        let newStatus;
        if (isUserErr) {
          // 经常会在微前端中出现这种情况，执行 app.loadApp 时返回的不是 Promise 对象
          // 这里会将 app 的状态设置为 SKIP_BECAUSE_BROKEN
          newStatus = SKIP_BECAUSE_BROKEN;
        } else {
          // 如果 app.loadApp 执行失败，将 app 的状态设置为 LOAD_ERROR
          newStatus = LOAD_ERROR;
          app.loadErrorTime = new Date().getTime();
        }
        handleAppError(err, app, newStatus);

        return app;
      }));
  });
}
