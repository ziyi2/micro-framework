import { reroute } from "./navigation/reroute.js";
import { formatErrorMessage } from "./applications/app-errors.js";
import { setUrlRerouteOnly } from "./navigation/navigation-events.js";
import { isInBrowser } from "./utils/runtime-environment.js";

let started = false;

/**
 * @description 启动 single-spa 应用
 * @export
 * @param opts
 */
export function start(opts) {
  console.log("[start.js]: start 函数开始执行...");
  // 标记 single-spa 已经启动
  started = true;

  // 如果 opts.urlRerouteOnly 为 true，执行 setUrlRerouteOnly 函数
  if (opts && opts.urlRerouteOnly) {
    setUrlRerouteOnly(opts.urlRerouteOnly);
  }
  // 如果是在浏览器环境中，执行 reroute 函数
  if (isInBrowser) {
    console.log("[start.js]: 在 start 中准备执行 reroute 函数...");
    reroute();
  }
}

// 判断 single-spa 是否已经启动
export function isStarted() {
  return started;
}

if (isInBrowser) {
  setTimeout(() => {
    if (!started) {
      console.warn(
        formatErrorMessage(
          1,
          __DEV__ &&
            `singleSpa.start() has not been called, 5000ms after single-spa was loaded. Before start() is called, apps can be declared and loaded, but not bootstrapped or mounted.`
        )
      );
    }
  }, 5000);
}
