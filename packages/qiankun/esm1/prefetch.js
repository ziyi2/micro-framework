/**
 * @author Kuitos
 * @since 2019-02-26
 */
import { importEntry } from 'import-html-entry';
import { isFunction } from 'lodash';
import { getAppStatus, getMountedApps, NOT_LOADED } from 'single-spa';
function idleCall(cb, start) {
  cb({
    didTimeout: false,
    timeRemaining() {
      return Math.max(0, 50 - (Date.now() - start));
    },
  });
}
// RIC and shim for browsers setTimeout() without it idle
// 如果浏览器支持 requestIdleCallback，则使用 requestIdleCallback
// 否则使用 MessageChannel 或 setTimeout 来模拟 requestIdleCallback
// 注意 MessageChannel 是微任务，setTimeout 是宏任务
// 为什么 MessageChannel 比 setTimeout 更好？
// 1. MessageChannel 是微任务，setTimeout 是宏任务
// 2. MessageChannel 没有 4ms 的延迟
// 3. MessageChannel 可以在页面隐藏时继续执行，setTimeout 不能
// 都是异步任务，但是执行时机不同，MessageChannel 是微任务，setTimeout 是宏任务

// 尽管 MessageChannel 不完全等同于 requestIdleCallback，
// 因为它不能决定何时处于浏览器的空闲状态，但它提供了一种在事件循环尾部执行任务的机制
// 虽然这种方法没有直接管理浏览器空闲时间的能力，
// 但它依然可以在某些场景下作为 requestIdleCallback 的简化替代方案
let requestIdleCallback;
if (typeof window.requestIdleCallback !== 'undefined') {
  requestIdleCallback = window.requestIdleCallback;
} else if (typeof window.MessageChannel !== 'undefined') {
  // The first recommendation is to use MessageChannel because
  // it does not have the 4ms delay of setTimeout
  const channel = new MessageChannel();
  const port = channel.port2;
  const tasks = [];
  channel.port1.onmessage = ({ data }) => {
    const task = tasks.shift();
    if (!task) {
      return;
    }
    idleCall(task, data.start);
  };
  requestIdleCallback = function (cb) {
    tasks.push(cb);
    port.postMessage({ start: Date.now() });
  };
} else {
  requestIdleCallback = (cb) => setTimeout(idleCall, 0, cb, Date.now());
}
// 检测是否为慢网络
const isSlowNetwork = navigator.connection
  ? navigator.connection.saveData ||
    (navigator.connection.type !== 'wifi' &&
      navigator.connection.type !== 'ethernet' &&
      // effectiveType 为 2g 或 3g 时，认为是慢网络
      // https://developer.mozilla.org/zh-CN/docs/Web/API/NetworkInformation/effectiveType
      /([23])g/.test(navigator.connection.effectiveType))
  : false;
/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param opts
 */
function prefetch(entry, opts) {
  // 如果是慢网络或者离线状态，则不进行预加载
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }
  // 使用 requestIdleCallback 来执行预加载
  // requestIdleCallback 会在浏览器空闲时执行回调函数
  requestIdleCallback(async () => {
    // 通过 import-html-entry 来加载微应用的资源
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, opts);
    // 通过 requestIdleCallback 来执行 getExternalStyleSheets 和 getExternalScripts
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}
// 在第一个微应用加载完成后再预加载其他微应用
function prefetchAfterFirstMounted(apps, opts) {
  // 监听 single-spa:first-mount 事件，等待第一个激活的微应用挂载完成
  window.addEventListener('single-spa:first-mount', function listener() {
    // 过滤出未加载的微应用
    const notLoadedApps = apps.filter((app) => getAppStatus(app.name) === NOT_LOADED);
    // 如果是开发环境，则打印日志
    if (process.env.NODE_ENV === 'development') {
      const mountedApps = getMountedApps();
      console.log(`[qiankun] prefetch starting after ${mountedApps} mounted...`, notLoadedApps);
    }
    // 遍历未加载的微应用，预加载微应用的资源
    notLoadedApps.forEach(({ entry }) => prefetch(entry, opts));
    // 移除 single-spa:first-mount 事件监听
    window.removeEventListener('single-spa:first-mount', listener);
  });
}
// 立即预加载所有微应用
export function prefetchImmediately(apps, opts) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }
  apps.forEach(({ entry }) => prefetch(entry, opts));
}

// 预加载微应用的资源策略
// 1. prefetchStrategy 为数组时，预加载数组中的微应用
// 2. prefetchStrategy 为函数时，根据函数返回的结果预加载微应用
// 3. prefetchStrategy 为 true 时，等待第一个微应用加载完成后再预加载其他微应用
// 4. prefetchStrategy 为 'all' 时，立即预加载所有微应用
// 5. prefetchStrategy 为其他值时，不进行预加载
export function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
  const appsName2Apps = (names) => apps.filter((app) => names.includes(app.name));
  // 如果 prefetchStrategy 是数组，则预加载数组中的微应用
  if (Array.isArray(prefetchStrategy)) {
    // 根据数组中的微应用名称决定预加载哪些微应用
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
    // 如果 prefetchStrategy 是函数，则根据函数返回的结果预加载微应用
  } else if (isFunction(prefetchStrategy)) {
    (async () => {
      // critical rendering apps would be prefetch as earlier as possible
      // 1. criticalAppNames 为关键渲染应用的名称数组，这些应用会尽可能早地预加载
      // 2. minorAppsName 为非关键渲染应用的名称数组， 这些应用会在第一个应用加载完成后再预加载
      const { criticalAppNames = [], minorAppsName = [] } = await prefetchStrategy(apps);
      prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
      prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);
    })();
  } else {
    switch (prefetchStrategy) {
      // 如果 prefetchStrategy 为 true，则等待第一个微应用加载完成后再预加载其他微应用
      case true:
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;
      // 如果 prefetchStrategy 为 'all'，则立即预加载所有微应用
      case 'all':
        prefetchImmediately(apps, importEntryOpts);
        break;
      default:
        break;
    }
  }
}
