import CustomEvent from "custom-event";
import { isStarted } from "../start.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toBootstrapPromise } from "../lifecycles/bootstrap.js";
import { toMountPromise } from "../lifecycles/mount.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import {
  getAppStatus,
  getAppChanges,
  getMountedApps,
} from "../applications/apps.js";
import {
  callCapturedEventListeners,
  navigateToUrl,
} from "./navigation-events.js";
import { toUnloadPromise } from "../lifecycles/unload.js";
import {
  toName,
  shouldBeActive,
  NOT_MOUNTED,
  MOUNTED,
  NOT_LOADED,
  SKIP_BECAUSE_BROKEN,
} from "../applications/app.helpers.js";
import { assign } from "../utils/assign.js";
import { isInBrowser } from "../utils/runtime-environment.js";

let appChangeUnderway = false,
  peopleWaitingOnAppChange = [],
  currentUrl = isInBrowser && window.location.href;

export function triggerAppChange() {
  console.log(
    "[navigation/reroute.js - triggerAppChange]: 在 triggerAppChange 中准备执行 reroute 函数..."
  );
  // Call reroute with no arguments, intentionally
  return reroute();
}

/**
 * @description 重新路由
 * 触发的时机：
 * 1. 当浏览器的 url 发生变化
 * 2. 当调用 start() 方法后
 * 3. 当调用 registerApplication() 方法后
 * 4. 当调用 navigateToUrl() 方法后
 * 5. 当调用 triggerAppChange() 方法后
 * 6. 当调用 unloadApplication() 方法后
 * 7. 当调用 loadApplication() 方法后
 * 8. 当调用 mountRootParcel() 方法后
 * 9. 当调用 unmountRootParcel() 方法后
 *
 * 总结：
 * retoute 主要是在应用发生变化时触发，比如新增、删除、更新、加载、去加载、卸载、挂载应用等。
 *
 * @export
 * @param [pendingPromises=[]] 等待应用变化的 Promise 数组
 * @param eventArguments 事件参数
 * @returns {*}
 */
export function reroute(pendingPromises = [], eventArguments) {
  // eslint-disable-next-line no-console
  console.log("[navigation/reroute.js - reroute]: reroute 函数开始执行...");

  // 如果当前正在进行应用变化，则将 eventArguments 存储到 peopleWaitingOnAppChange 数组中
  // 这里主要用于处理多个应用同时发生变化的情况，比如同时加载多个应用
  if (appChangeUnderway) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnAppChange.push({
        resolve,
        reject,
        eventArguments,
      });
    });
  }

  // 获取当前应用的变化情况
  // 1. appsToUnload: 需要去加载的应用
  // 2. appsToUnmount: 需要卸载的应用
  // 3. appsToLoad: 需要加载的应用
  // 4. appsToMount: 需要挂载的应用
  const { appsToUnload, appsToUnmount, appsToLoad, appsToMount } =
    getAppChanges();
  let appsThatChanged,
    navigationIsCanceled = false,
    oldUrl = currentUrl,
    newUrl = (currentUrl = window.location.href);

  // 如果已经调用了 singleSpa.start() 方法
  // 调用 singleSpa.registerApplication() 方法后，再调用 singleSpa.start() 方法之后会走到这里
  if (isStarted()) {
    // 设置当前应用变化正在进行中，避免多次触发应用变化
    appChangeUnderway = true;
    appsThatChanged = appsToUnload.concat(
      appsToLoad,
      appsToUnmount,
      appsToMount
    );
    console.log(
      "[navigation/reroute.js - reroute]: appsToUnload 数据: ",
      appsToUnload
    );
    console.log(
      "[navigation/reroute.js - reroute]: appsToUnmount 数据: ",
      appsToUnmount
    );
    console.log(
      "[navigation/reroute.js - reroute]: appsToLoad 数据: ",
      appsToLoad
    );
    console.log(
      "[navigation/reroute.js - reroute]: appsToMount 数据: ",
      appsToMount
    );
    console.log(
      "[navigation/reroute.js - reroute]: 准备执行 performAppChanges..."
    );
    return performAppChanges();
    // 如果没有调用 singleSpa.start() 方法
    // 调用 singleSpa.registerApplication() 方法后，还没有调用 singleSpa.start() 方法之前会走到这里
  } else {
    appsThatChanged = appsToLoad;
    console.log("[navigation/reroute.js - reroute]: 准备执行 loadApps...");
    return loadApps();
  }

  function cancelNavigation() {
    navigationIsCanceled = true;
  }

  /**
   * @description 加载应用
   * @returns
   */
  function loadApps() {
    console.log("[navigation/reroute.js - loadApps]: loadApps 开始执行...");
    return Promise.resolve().then(() => {
      console.log(
        "[navigation/reroute.js - loadApps]: loadApps 的 Promise.resolve 开始执行..."
      );
      const loadPromises = appsToLoad.map(toLoadPromise);

      return (
        Promise.all(loadPromises)
          .then(callAllEventListeners)
          .then(() => {
            console.log(
              "[navigation/reroute.js - loadApps]: 所有子应用的 app.loadApp 方法（registerApplication 的第二个参数 app）执行完毕。"
            );
          })
          // there are no mounted apps, before start() is called, so we always return []
          .then(() => [])
          .catch((err) => {
            callAllEventListeners();
            throw err;
          })
      );
    });
  }

  /**
   * @description 执行应用变化
   * @returns {*}
   */
  function performAppChanges() {
    console.log(
      "[navigation/reroute.js - performAppChanges]: performAppChanges 开始执行..."
    );
    return Promise.resolve().then(() => {
      console.log(
        "[navigation/reroute.js - performAppChanges]: performAppChanges 的 Promise.resolve 开始执行..."
      );
      // https://github.com/single-spa/single-spa/issues/545
      window.dispatchEvent(
        new CustomEvent(
          appsThatChanged.length === 0
            ? "single-spa:before-no-app-change"
            : "single-spa:before-app-change",
          getCustomEventDetail(true)
        )
      );

      console.log(
        "[navigation/reroute.js - performAppChanges]: 触发 window.dispatchEvent 的 single-spa:before-routing-event 事件， event: ",
        getCustomEventDetail(true, { cancelNavigation })
      );

      // 通过监听 single-spa:before-routing-event 事件，可以取消导航
      window.dispatchEvent(
        new CustomEvent(
          "single-spa:before-routing-event",
          getCustomEventDetail(true, { cancelNavigation })
        )
      );

      // 如果取消了导航，则直接返回
      if (navigationIsCanceled) {
        window.dispatchEvent(
          new CustomEvent(
            "single-spa:before-mount-routing-event",
            getCustomEventDetail(true)
          )
        );
        finishUpAndReturn();
        navigateToUrl(oldUrl);
        return;
      }

      const unloadPromises = appsToUnload.map(toUnloadPromise);
      console.log(
        "[navigation/reroute.js - performAppChanges]: performAppChanges 中的 unloadPromises 数据: ",
        unloadPromises
      );

      const unmountUnloadPromises = appsToUnmount
        .map(toUnmountPromise)
        .map((unmountPromise) => unmountPromise.then(toUnloadPromise));

      const allUnmountPromises = unmountUnloadPromises.concat(unloadPromises);
      const unmountAllPromise = Promise.all(allUnmountPromises);

      console.log(
        "[navigation/reroute.js - performAppChanges]: 准备执行所有子应用的 toUnmountPromise 和 toUnloadPromise 方法..."
      );
      unmountAllPromise.then(() => {
        window.dispatchEvent(
          new CustomEvent(
            "single-spa:before-mount-routing-event",
            getCustomEventDetail(true)
          )
        );
      });

      console.log(
        "[navigation/reroute.js - performAppChanges]: performAppChanges 中的 unmountAllPromise 数据: ",
        unmountAllPromise
      );

      /* We load and bootstrap apps while other apps are unmounting, but we
       * wait to mount the app until all apps are finishing unmounting
       */
      const loadThenMountPromises = appsToLoad.map((app) => {
        console.log(
          "[navigation/reroute.js - performAppChanges]: 准备执行子应用的 app.loadApp 方法（registerApplication 的第二个参数 app）...",
          app.name,
          app.status
        );
        return toLoadPromise(app).then((app) => {
          console.log(
            "[navigation/reroute.js - performAppChanges]: 子应用的 app.loadApp 方法执行完毕，准备执行子应用的周期函数 bootstrap 和 mount ...",
            app.name,
            app.status
          );
          tryToBootstrapAndMount(app, unmountAllPromise);
        });
      });

      console.log(
        "[navigation/reroute.js - performAppChanges]: performAppChanges 中的  loadThenMountPromises 数据: ",
        loadThenMountPromises
      );

      /* These are the apps that are already bootstrapped and just need
       * to be mounted. They each wait for all unmounting apps to finish up
       * before they mount.
       */
      const mountPromises = appsToMount
        .filter((appToMount) => appsToLoad.indexOf(appToMount) < 0)
        .map((appToMount) => {
          console.log(
            "[navigation/reroute.js - performAppChanges]: appsToMount 准备执行子应用的周期函数 bootstrap 和 mount ..."
          );
          return tryToBootstrapAndMount(appToMount, unmountAllPromise);
        });

      console.log(
        "[navigation/reroute.js - performAppChanges]: performAppChanges 中的 mountPromises 数据: ",
        mountPromises
      );

      return unmountAllPromise
        .catch((err) => {
          callAllEventListeners();
          throw err;
        })
        .then(() => {
          /* Now that the apps that needed to be unmounted are unmounted, their DOM navigation
           * events (like hashchange or popstate) should have been cleaned up. So it's safe
           * to let the remaining captured event listeners to handle about the DOM event.
           */
          callAllEventListeners();

          return Promise.all(loadThenMountPromises.concat(mountPromises))
            .catch((err) => {
              pendingPromises.forEach((promise) => promise.reject(err));
              throw err;
            })
            .then(finishUpAndReturn);
        });
    });
  }

  function finishUpAndReturn() {
    console.log(
      "[navigation/reroute.js - finishUpAndReturn]: finishUpAndReturn 开始执行..."
    );

    const returnValue = getMountedApps();
    console.log(
      "[navigation/reroute.js - finishUpAndReturn]: finishUpAndReturn 中的 returnValue 数据: ",
      returnValue
    );
    pendingPromises.forEach((promise) => promise.resolve(returnValue));
    console.log(
      "[navigation/reroute.js - finishUpAndReturn]: finishUpAndReturn 中的 pendingPromises 数据: ",
      pendingPromises
    );

    try {
      const appChangeEventName =
        appsThatChanged.length === 0
          ? "single-spa:no-app-change"
          : "single-spa:app-change";
      window.dispatchEvent(
        new CustomEvent(appChangeEventName, getCustomEventDetail())
      );
      window.dispatchEvent(
        new CustomEvent("single-spa:routing-event", getCustomEventDetail())
      );
    } catch (err) {
      /* We use a setTimeout because if someone else's event handler throws an error, single-spa
       * needs to carry on. If a listener to the event throws an error, it's their own fault, not
       * single-spa's.
       */
      setTimeout(() => {
        throw err;
      });
    }

    /* Setting this allows for subsequent calls to reroute() to actually perform
     * a reroute instead of just getting queued behind the current reroute call.
     * We want to do this after the mounting/unmounting is done but before we
     * resolve the promise for the `reroute` function.
     */
    appChangeUnderway = false;

    if (peopleWaitingOnAppChange.length > 0) {
      /* While we were rerouting, someone else triggered another reroute that got queued.
       * So we need reroute again.
       */
      const nextPendingPromises = peopleWaitingOnAppChange;
      peopleWaitingOnAppChange = [];
      console.log(
        "[navigation/reroute.js - finishUpAndReturn]: 在 finishUpAndReturn 中准备执行 reroute 函数..."
      );
      reroute(nextPendingPromises);
    }

    return returnValue;
  }

  /* We need to call all event listeners that have been delayed because they were
   * waiting on single-spa. This includes haschange and popstate events for both
   * the current run of performAppChanges(), but also all of the queued event listeners.
   * We want to call the listeners in the same order as if they had not been delayed by
   * single-spa, which means queued ones first and then the most recent one.
   */
  function callAllEventListeners() {
    console.log(
      "[navigation/reroute.js - callAllEventListeners]: callAllEventListeners 中的 pendingPromises 数据： ",
      pendingPromises
    );
    pendingPromises.forEach((pendingPromise) => {
      callCapturedEventListeners(pendingPromise.eventArguments);
    });

    callCapturedEventListeners(eventArguments);
  }

  /**
   * @description 获取自定义事件详情信息
   * @param isBeforeChanges 是否在应用变化之前
   * @param extraProperties 额外的属性，例如 { cancelNavigation }
   * @returns {Object} 自定义事件详情信息
   */
  function getCustomEventDetail(isBeforeChanges = false, extraProperties) {
    const newAppStatuses = {};
    const appsByNewStatus = {
      // for apps that were mounted
      [MOUNTED]: [],
      // for apps that were unmounted
      [NOT_MOUNTED]: [],
      // apps that were forcibly unloaded
      [NOT_LOADED]: [],
      // apps that attempted to do something but are broken now
      [SKIP_BECAUSE_BROKEN]: [],
    };

    // 如果在应用变化之前，则获取应用的状态
    if (isBeforeChanges) {
      appsToLoad.concat(appsToMount).forEach((app, index) => {
        addApp(app, MOUNTED);
      });
      appsToUnload.forEach((app) => {
        addApp(app, NOT_LOADED);
      });
      appsToUnmount.forEach((app) => {
        addApp(app, NOT_MOUNTED);
      });
    } else {
      appsThatChanged.forEach((app) => {
        addApp(app);
      });
    }

    // 发送事件时包装的详细信息
    const result = {
      detail: {
        newAppStatuses,
        appsByNewStatus,
        totalAppChanges: appsThatChanged.length,
        originalEvent: eventArguments?.[0],
        oldUrl,
        newUrl,
        navigationIsCanceled,
      },
    };

    // 如果有额外的属性，则添加到 result.detail 对象中
    if (extraProperties) {
      assign(result.detail, extraProperties);
    }

    return result;

    /**
     * @description 添加应用
     * @param app 应用
     * @param status 状态
     */
    function addApp(app, status) {
      // 获取应用的名称
      const appName = toName(app);
      // 获取应用的状态
      status = status || getAppStatus(appName);
      // 将应用的状态添加到 newAppStatuses 对象中
      newAppStatuses[appName] = status;
      // 将应用的名称添加到 appsByNewStatus 对象中
      // 例如：appsByNewStatus = { MOUNTED: ['app1', 'app2'], NOT_MOUNTED: ['app3', 'app4'] }
      const statusArr = (appsByNewStatus[status] =
        appsByNewStatus[status] || []);
      statusArr.push(appName);
    }
  }
}

/**
 * Let's imagine that some kind of delay occurred during application loading.
 * The user without waiting for the application to load switched to another route,
 * this means that we shouldn't bootstrap and mount that application, thus we check
 * twice if that application should be active before bootstrapping and mounting.
 * https://github.com/single-spa/single-spa/issues/524
 */
function tryToBootstrapAndMount(app, unmountAllPromise) {
  console.log(
    "[navigation/reroute.js - tryToBootstrapAndMount]: tryToBootstrapAndMount 函数开始执行...",
    app.name,
    app.status
  );
  if (shouldBeActive(app)) {
    console.log(
      "[navigation/reroute.js - tryToBootstrapAndMount]: 准备执行子应用的 bootstrap 方法...",
      app.name,
      app.status
    );
    return toBootstrapPromise(app).then((app) => {
      console.log(
        "[navigation/reroute.js - tryToBootstrapAndMount]: 准备执行所有子应用的 unmount 方法...",
        unmountAllPromise
      );
      unmountAllPromise.then(() => {
        console.log(
          "[navigation/reroute.js - tryToBootstrapAndMount]: 准备执行子应用的 mount 方法...",
          app.name,
          app.status
        );
        shouldBeActive(app) ? toMountPromise(app) : app;
      });
    });
  } else {
    return unmountAllPromise.then(() => app);
  }
}
