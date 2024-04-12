import { reroute } from "./reroute.js";
import { find } from "../utils/find.js";
import { formatErrorMessage } from "../applications/app-errors.js";
import { isInBrowser } from "../utils/runtime-environment.js";
import { isStarted } from "../start.js";

/* We capture navigation event listeners so that we can make sure
 * that application navigation listeners are not called until
 * single-spa has ensured that the correct applications are
 * unmounted and mounted.
 */
// 在 single-spa 中会捕获导航事件监听器，进行延迟执行
// 例如微应用 A 在 unmount 中移除了 hashchange 事件监听器，在微应用 A  unmount 时触发了 hashchange 事件，
// 为了防止微应用 A 执行 hashchange 事件，需要在 single-spa 中提前捕获 hashchange 事件，等待微应用 A unmount 完成后再延迟执行 hashchange 事件监听器
// capturedEventListeners 用于存储捕获的事件监听器
const capturedEventListeners = {
  hashchange: [],
  popstate: [],
};

export const routingEventsListeningTo = ["hashchange", "popstate"];

export function navigateToUrl(obj) {
  let url;
  if (typeof obj === "string") {
    url = obj;
  } else if (this && this.href) {
    url = this.href;
  } else if (
    obj &&
    obj.currentTarget &&
    obj.currentTarget.href &&
    obj.preventDefault
  ) {
    url = obj.currentTarget.href;
    obj.preventDefault();
  } else {
    throw Error(
      formatErrorMessage(
        14,
        __DEV__ &&
          `singleSpaNavigate/navigateToUrl must be either called with a string url, with an <a> tag as its context, or with an event whose currentTarget is an <a> tag`
      )
    );
  }

  const current = parseUri(window.location.href);
  const destination = parseUri(url);

  if (url.indexOf("#") === 0) {
    window.location.hash = destination.hash;
  } else if (current.host !== destination.host && destination.host) {
    if (process.env.BABEL_ENV === "test") {
      return { wouldHaveReloadedThePage: true };
    } else {
      window.location.href = url;
    }
  } else if (
    destination.pathname === current.pathname &&
    destination.search === current.search
  ) {
    window.location.hash = destination.hash;
  } else {
    // different path, host, or query params
    window.history.pushState(null, null, url);
  }
}

/**
 * @description 在 single-spa 中延迟执行捕获的事件监听器（批量加载微应用后、批量 unmount 微应用后）
 * @export
 * @param eventArguments 事件参数
 */
export function callCapturedEventListeners(eventArguments) {
  console.log(
    "[navigation/navigation-events.js - callCapturedEventListeners]: callCapturedEventListeners 函数开始执行...",
    eventArguments
  );
  // 如果 eventArguments 存在，则会执行 capturedEventListeners 中对应事件类型的监听器
  // 注意这里的 eventArguments 由 createPopStateEvent 函数创建，是一个 PopStateEvent 实例
  // 例如触发流程：history.pushState（React 或者 Vue 框架路由变化） -> patchedUpdateState -> createPopStateEvent -> window.dispatchEvent -> window.addEventListener -> urlReroute -> reroute -> performAppChanges -> 批量 unmount 执行完毕 -> callCapturedEventListeners
  if (eventArguments) {
    const eventType = eventArguments[0].type;
    if (routingEventsListeningTo.indexOf(eventType) >= 0) {
      // 遍历 capturedEventListeners 中对应事件类型的监听器，执行监听器
      capturedEventListeners[eventType].forEach((listener) => {
        try {
          // The error thrown by application event listener should not break single-spa down.
          // Just like https://github.com/single-spa/single-spa/blob/85f5042dff960e40936f3a5069d56fc9477fac04/src/navigation/reroute.js#L140-L146 did
          listener.apply(this, eventArguments);
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      });
    }
  }
}

let urlRerouteOnly;

// 设置 urlRerouteOnly 变量，如果为 true，则只有 url 变化时才会执行 reroute 函数
// 在 start 函数中可以传递 opts.urlRerouteOnly 参数触发执行 setUrlRerouteOnly 函数
export function setUrlRerouteOnly(val) {
  urlRerouteOnly = val;
}

// urlReroute 函数，会携带事件参数，携带事件参数的 urlReroute 函数最终会执行 callCapturedEventListeners 函数
function urlReroute() {
  console.log(
    "[navigation/navigation-events.js - urlReroute]: 在 urlReroute 中准备执行 reroute 函数..."
  );
  // 最终会将 arguments 传递给 callCapturedEventListeners 函数
  reroute([], arguments);
}

/**
 * @description 重写 window.history.pushState 和 window.history.replaceState 方法
 * @param updateState window.history.pushState 或 window.history.replaceState
 * @param methodName pushState 或 replaceState
 * @returns {*}
 */
function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    // 执行原生的 pushState 或 replaceState 方法（这里也是为什么 React 框架和 Vue 框架路由变化后，single-spa 能够触发微应用激活和失活的主要原因）
    const result = updateState.apply(this, arguments);
    const urlAfter = window.location.href;

    // 如果 urlRerouteOnly 为 true，则只会判断 url 是否发生变化，如果发生变化，则执行 reroute 函数
    // 如果为 false, 则不管 url 是否发生变化，都会执行 reroute 函数
    if (!urlRerouteOnly || urlBefore !== urlAfter) {
      if (isStarted()) {
        // fire an artificial popstate event once single-spa is started,
        // so that single-spa applications know about routing that
        // occurs in a different application
        // 在 single-spa 启动之后，触发人工的 popstate 事件，以便 single-spa 延迟执行事件监听器
        window.dispatchEvent(
          createPopStateEvent(window.history.state, methodName)
        );
      } else {
        // do not fire an artificial popstate event before single-spa is started,
        // since no single-spa applications need to know about routing events
        // outside of their own router.
        // 在 single-spa 启动之前，不要触发人工的 popstate 事件，因为没有启动微前端，没有微应用需要 unmount 或者 mount，也就不需要延迟执行事件监听器
        console.log(
          "[navigation/navigation-events.js - patchedUpdateState]: 在 patchedUpdateState 中准备执行 reroute 函数..."
        );
        reroute([]);
      }
    }

    return result;
  };
}

/**
 * @description 创建 popstate 事件
 * @param state
 * @param originalMethodName
 * @returns {*}
 */
function createPopStateEvent(state, originalMethodName) {
  // https://github.com/single-spa/single-spa/issues/224 and https://github.com/single-spa/single-spa-angular/issues/49
  // We need a popstate event even though the browser doesn't do one by default when you call replaceState, so that
  // all the applications can reroute. We explicitly identify this extraneous event by setting singleSpa=true and
  // singleSpaTrigger=<pushState|replaceState> on the event instance.
  let evt;
  try {
    // 创建 popstate 事件
    evt = new PopStateEvent("popstate", { state });
  } catch (err) {
    // IE 11 compatibility https://github.com/single-spa/single-spa/issues/299
    // https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-html5e/bd560f47-b349-4d2c-baa8-f1560fb489dd
    evt = document.createEvent("PopStateEvent");
    evt.initPopStateEvent("popstate", false, false, state);
  }
  evt.singleSpa = true;
  evt.singleSpaTrigger = originalMethodName;
  return evt;
}

if (isInBrowser) {
  // We will trigger an app change for any routing events.
  // 监听 hashchange 事件，执行 urlReroute 函数
  window.addEventListener("hashchange", (event) => {
    console.log(
      "[navigation/navigation-events.js - hashchange]: 在 hashchange 中准备执行 urlReroute 函数..."
    );
    urlReroute(event);
  });
  // 监听 popstate 事件，执行 urlReroute 函数
  window.addEventListener("popstate", (event) => {
    console.log(
      "[navigation/navigation-events.js - popstate]: 在 popstate 中准备执行 urlReroute 函数..."
    );
    urlReroute(event);
  });

  // Monkeypatch addEventListener so that we can ensure correct timing
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  // 重写 window.addEventListener 方法，用于捕获 hashchange 和 popstate 事件监听器
  window.addEventListener = function (eventName, fn) {
    if (typeof fn === "function") {
      if (
        // 如果是 hashchange 或者 popstate 事件，并且 capturedEventListeners 中没有对应事件监听器
        // 则将事件监听器添加到 capturedEventListeners 中
        routingEventsListeningTo.indexOf(eventName) >= 0 &&
        !find(capturedEventListeners[eventName], (listener) => listener === fn)
      ) {
        capturedEventListeners[eventName].push(fn);
        return;
      }
    }

    // 如果不是 hashchange 或者 popstate 事件，或者 capturedEventListeners 中已经存在对应事件监听器，则执行原生的 addEventListener 方法
    return originalAddEventListener.apply(this, arguments);
  };

  // 重写 window.removeEventListener 方法，用于移除 hashchange 和 popstate 事件监听器
  window.removeEventListener = function (eventName, listenerFn) {
    if (typeof listenerFn === "function") {
      if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[
          eventName
        ].filter((fn) => fn !== listenerFn);
        return;
      }
    }

    return originalRemoveEventListener.apply(this, arguments);
  };

  // 重写 window.history.pushState 方法，用于捕获 React 或者 Vue 框架路由变化
  window.history.pushState = patchedUpdateState(
    window.history.pushState,
    "pushState"
  );
  // 重写 window.history.replaceState 方法，用于捕获 React 或者 Vue 框架路由变化
  window.history.replaceState = patchedUpdateState(
    window.history.replaceState,
    "replaceState"
  );

  if (window.singleSpaNavigate) {
    console.warn(
      formatErrorMessage(
        41,
        __DEV__ &&
          "single-spa has been loaded twice on the page. This can result in unexpected behavior."
      )
    );
  } else {
    /* For convenience in `onclick` attributes, we expose a global function for navigating to
     * whatever an <a> tag's href is.
     */
    window.singleSpaNavigate = navigateToUrl;
  }
}

function parseUri(str) {
  const anchor = document.createElement("a");
  anchor.href = str;
  return anchor;
}
