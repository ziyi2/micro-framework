import { getAppStatus, getMountedApps, NOT_LOADED } from "single-spa";
import type { Entry } from "import-html-entry";
import { importEntry } from "import-html-entry";
import { isFunction } from "lodash";
import { IRegisterApp, PrefetchStrategy } from "./interfaces";

export function doPrefetchStrategy(
  apps: IRegisterApp[],
  prefetchStrategy: PrefetchStrategy
) {
  const appsName2Apps = (names: string[]): IRegisterApp[] =>
    // 从已经注册的微应用列表中过滤出需要预加载的微应用
    apps.filter((app) => names.includes(app.name));

  // 判断是否是传入了预加载的 app 列表信息
  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy));
  } else if (isFunction(prefetchStrategy)) {
    // critical rendering apps would be prefetch as earlier as possible
    // criticalAppNames: 高优先级的微应用列表
    // minorAppsName: 优先级低的微应用列表
    const { criticalAppNames = [], minorAppsName = [] } =
      prefetchStrategy(apps);
    // 高优先级的微应用立即预加载，不论框架是否激活微应用
    prefetchImmediately(appsName2Apps(criticalAppNames));
    // 低优先级的微应用在第一个微应用加载完毕后预加载
    prefetchAfterFirstMounted(appsName2Apps(minorAppsName));
  } else {
    switch (prefetchStrategy) {
      case true:
        prefetchAfterFirstMounted(apps);
        break;

      case "all":
        prefetchImmediately(apps);
        break;

      default:
        break;
    }
  }
}

function prefetchAfterFirstMounted(apps: IRegisterApp[]) {
  // 等待第一个微应用加载完毕（如果第一个微应用加载完成，那么说明微前端框架已经开始工作）
  // 如果微前端框架未激活任何微应用，则不需要对任何微应用进行预加载处理，防止无效的预加载
  window.addEventListener("single-spa:first-mount", function listener() {
    // 过滤出为加载的微应用（已经加载的微应用无须再次预加载，资源已经在 import-html-entry 中进行缓存）
    const notLoadedApps = apps.filter(
      (app) => getAppStatus(app.name) === NOT_LOADED
    );

    if (process.env.NODE_ENV === "development") {
      const mountedApps = getMountedApps();
      console.log(
        `[Framework] prefetch starting after ${mountedApps.toString()} mounted...`,
        notLoadedApps
      );
    }

    notLoadedApps.forEach(({ entry }) => prefetch(entry));

    // 移除监听器，防止内存泄漏
    window.removeEventListener("single-spa:first-mount", listener);
  });
}

export function prefetchImmediately(apps: IRegisterApp[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Framework] prefetch starting for apps...", apps);
  }
  apps.forEach(({ entry }) => prefetch(entry));
}

const isSlowNetwork = navigator.connection
  ? navigator.connection.saveData ||
    (navigator.connection.type !== "wifi" &&
      navigator.connection.type !== "ethernet" &&
      /([23])g/.test(navigator.connection.effectiveType))
  : false;

function prefetch(entry: Entry) {
  // 如果网络不在线或者网络较慢，则不进行预加载处理
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

  // 在浏览器空闲时进行预加载
  window.requestIdleCallback(async () => {
    // 通过 import-html-entry 请求微应用的资源后内部会进行缓存
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(
      entry
    );
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}
