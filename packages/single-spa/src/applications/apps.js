import { ensureJQuerySupport } from "../jquery-support.js";
import {
  isActive,
  toName,
  NOT_LOADED,
  NOT_BOOTSTRAPPED,
  NOT_MOUNTED,
  MOUNTED,
  LOAD_ERROR,
  SKIP_BECAUSE_BROKEN,
  LOADING_SOURCE_CODE,
  shouldBeActive,
} from "./app.helpers.js";
import { reroute } from "../navigation/reroute.js";
import { find } from "../utils/find.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import {
  toUnloadPromise,
  getAppUnloadInfo,
  addAppToUnload,
} from "../lifecycles/unload.js";
import { formatErrorMessage } from "./app-errors.js";
import { isInBrowser } from "../utils/runtime-environment.js";
import { assign } from "../utils/assign";

const apps = [];

/**
 * @description 计算应用的变更情况
 * @export
 * @returns {Object} 返回变更的应用
 */
export function getAppChanges() {
  const appsToUnload = [],
    appsToUnmount = [],
    appsToLoad = [],
    appsToMount = [];

  // We re-attempt to download applications in LOAD_ERROR after a timeout of 200 milliseconds
  const currentTime = new Date().getTime();

  apps.forEach((app) => {
    // 判断应用是否应该激活
    // 1. 如果应用的状态是 SKIP_BECAUSE_BROKEN，那么不需要激活
    // 2. 通过 shouldBeActive 函数判断应用是否应该激活
    const appShouldBeActive =
      app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);

    // 状态机（即将进行状态转换），对应用进行分类
    switch (app.status) {
      // 应用之前的状态是 LOAD_ERROR
      case LOAD_ERROR:
        // 判断应用是否要加载：如果应用之前加载失败，此时被激活，并且加载失败的时间超过 200 毫秒，那么即将重新加载应用
        if (appShouldBeActive && currentTime - app.loadErrorTime >= 200) {
          appsToLoad.push(app);
        }
        break;

      // 应用之前的状态是 NOT_LOADED 或者 LOADING_SOURCE_CODE
      // 1. 注册应用后，应用的初始状态是 NOT_LOADED
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        // 判断应用是否要加载：如果应用被激活，那么即将加载应用
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      // 应用之前的状态是 NOT_BOOTSTRAPPED 或者 NOT_MOUNTED
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        // 判断应用是否要去加载
        // 1. 如果应用被激活
        // 2. 如果确实被标记了要去卸载，在 lifecycles/unload.js 中会维护 appsToUnload 对象，用于标记应用是否要去加载
        if (!appShouldBeActive && getAppUnloadInfo(toName(app))) {
          appsToUnload.push(app);
          // 判断应用是否要挂载：如果应用被激活，那么即将挂载应用
        } else if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;

      // 应用之前的状态是 MOUNTED
      case MOUNTED:
        // 判断应用是否要卸载：如果应用失活，那么即将卸载应用
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
      // all other statuses are ignored
    }
  });

  return { appsToUnload, appsToUnmount, appsToLoad, appsToMount };
}

export function getMountedApps() {
  return apps.filter(isActive).map(toName);
}

export function getAppNames() {
  return apps.map(toName);
}

// used in devtools, not (currently) exposed as a single-spa API
export function getRawAppData() {
  return [...apps];
}

export function getAppStatus(appName) {
  const app = find(apps, (app) => toName(app) === appName);
  return app ? app.status : null;
}

/**
 * @
 * @description 注册微应用
 * @export
 * @param appNameOrConfig 应用名称或者应用配置对象
 * @param appOrLoadApp  应用对象或者加载应用的函数，返回值是一个 Promise
 * @param activeWhen  一个函数或者字符串，用于判断应用是否激活
 * @param customProps 一个对象，用于传递自定义属性
 */
export function registerApplication(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  console.log(
    "[applications/apps.js - registerApplication] registerApplication 函数开始执行， app: ",
    appNameOrConfig
  );

  // 对注册应用的参数进行格式化
  const registration = sanitizeArguments(
    appNameOrConfig,
    appOrLoadApp,
    activeWhen,
    customProps
  );

  // 如果已经注册了同名的应用，那么抛出异常
  if (getAppNames().indexOf(registration.name) !== -1)
    throw Error(
      formatErrorMessage(
        21,
        __DEV__ &&
          `There is already an app registered with name ${registration.name}`,
        registration.name
      )
    );

  // 将注册应用缓存到 apps 数组中
  apps.push(
    // Object.assign() 的兼容性处理
    assign(
      {
        // 加载错误的时间
        loadErrorTime: null,
        // 应用的状态
        status: NOT_LOADED,
        parcels: {},
        devtools: {
          overlays: {
            options: {},
            selectors: [],
          },
        },
      },
      // 格式化后的注册应用参数
      registration
    )
  );

  if (isInBrowser) {
    // 支持 jQuery 的路由事件监听
    ensureJQuerySupport();
    console.log(
      "[applications/apps.js - registerApplication] 在 registerApplication 中准备执行 reroute 函数..."
    );
    reroute();
  }
}

export function checkActivityFunctions(location = window.location) {
  return apps.filter((app) => app.activeWhen(location)).map(toName);
}

export function unregisterApplication(appName) {
  if (apps.filter((app) => toName(app) === appName).length === 0) {
    throw Error(
      formatErrorMessage(
        25,
        __DEV__ &&
          `Cannot unregister application '${appName}' because no such application has been registered`,
        appName
      )
    );
  }

  return unloadApplication(appName).then(() => {
    const appIndex = apps.map(toName).indexOf(appName);
    apps.splice(appIndex, 1);
  });
}

export function unloadApplication(appName, opts = { waitForUnmount: false }) {
  if (typeof appName !== "string") {
    throw Error(
      formatErrorMessage(
        26,
        __DEV__ && `unloadApplication requires a string 'appName'`
      )
    );
  }
  const app = find(apps, (App) => toName(App) === appName);
  if (!app) {
    throw Error(
      formatErrorMessage(
        27,
        __DEV__ &&
          `Could not unload application '${appName}' because no such application has been registered`,
        appName
      )
    );
  }

  const appUnloadInfo = getAppUnloadInfo(toName(app));
  if (opts && opts.waitForUnmount) {
    // We need to wait for unmount before unloading the app

    if (appUnloadInfo) {
      // Someone else is already waiting for this, too
      return appUnloadInfo.promise;
    } else {
      // We're the first ones wanting the app to be resolved.
      const promise = new Promise((resolve, reject) => {
        addAppToUnload(app, () => promise, resolve, reject);
      });
      return promise;
    }
  } else {
    /* We should unmount the app, unload it, and remount it immediately.
     */

    let resultPromise;

    if (appUnloadInfo) {
      // Someone else is already waiting for this app to unload
      resultPromise = appUnloadInfo.promise;
      immediatelyUnloadApp(app, appUnloadInfo.resolve, appUnloadInfo.reject);
    } else {
      // We're the first ones wanting the app to be resolved.
      resultPromise = new Promise((resolve, reject) => {
        addAppToUnload(app, () => resultPromise, resolve, reject);
        immediatelyUnloadApp(app, resolve, reject);
      });
    }

    return resultPromise;
  }
}

function immediatelyUnloadApp(app, resolve, reject) {
  toUnmountPromise(app)
    .then(toUnloadPromise)
    .then(() => {
      resolve();
      setTimeout(() => {
        // reroute, but the unload promise is done
        console.log(
          "[applications/apps.js - immediatelyUnloadApp] 在 immediatelyUnloadApp 中准备执行 reroute 函数..."
        );
        reroute();
      });
    })
    .catch(reject);
}

function validateRegisterWithArguments(
  name,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  if (typeof name !== "string" || name.length === 0)
    throw Error(
      formatErrorMessage(
        20,
        __DEV__ &&
          `The 1st argument to registerApplication must be a non-empty string 'appName'`
      )
    );

  if (!appOrLoadApp)
    throw Error(
      formatErrorMessage(
        23,
        __DEV__ &&
          "The 2nd argument to registerApplication must be an application or loading application function"
      )
    );

  if (typeof activeWhen !== "function")
    throw Error(
      formatErrorMessage(
        24,
        __DEV__ &&
          "The 3rd argument to registerApplication must be an activeWhen function"
      )
    );

  if (!validCustomProps(customProps))
    throw Error(
      formatErrorMessage(
        22,
        __DEV__ &&
          "The optional 4th argument is a customProps and must be an object"
      )
    );
}

export function validateRegisterWithConfig(config) {
  if (Array.isArray(config) || config === null)
    throw Error(
      formatErrorMessage(
        39,
        __DEV__ && "Configuration object can't be an Array or null!"
      )
    );
  const validKeys = ["name", "app", "activeWhen", "customProps"];
  const invalidKeys = Object.keys(config).reduce(
    (invalidKeys, prop) =>
      validKeys.indexOf(prop) >= 0 ? invalidKeys : invalidKeys.concat(prop),
    []
  );
  if (invalidKeys.length !== 0)
    throw Error(
      formatErrorMessage(
        38,
        __DEV__ &&
          `The configuration object accepts only: ${validKeys.join(
            ", "
          )}. Invalid keys: ${invalidKeys.join(", ")}.`,
        validKeys.join(", "),
        invalidKeys.join(", ")
      )
    );
  if (typeof config.name !== "string" || config.name.length === 0)
    throw Error(
      formatErrorMessage(
        20,
        __DEV__ &&
          "The config.name on registerApplication must be a non-empty string"
      )
    );
  if (typeof config.app !== "object" && typeof config.app !== "function")
    throw Error(
      formatErrorMessage(
        20,
        __DEV__ &&
          "The config.app on registerApplication must be an application or a loading function"
      )
    );
  const allowsStringAndFunction = (activeWhen) =>
    typeof activeWhen === "string" || typeof activeWhen === "function";
  if (
    !allowsStringAndFunction(config.activeWhen) &&
    !(
      Array.isArray(config.activeWhen) &&
      config.activeWhen.every(allowsStringAndFunction)
    )
  )
    throw Error(
      formatErrorMessage(
        24,
        __DEV__ &&
          "The config.activeWhen on registerApplication must be a string, function or an array with both"
      )
    );
  if (!validCustomProps(config.customProps))
    throw Error(
      formatErrorMessage(
        22,
        __DEV__ && "The optional config.customProps must be an object"
      )
    );
}

function validCustomProps(customProps) {
  return (
    !customProps ||
    typeof customProps === "function" ||
    (typeof customProps === "object" &&
      customProps !== null &&
      !Array.isArray(customProps))
  );
}

/**
 * @description 对注册应用的参数进行格式化
 * @param appNameOrConfig 应用名称或者应用配置对象
 * @param appOrLoadApp 应用对象或者加载应用的函数，返回值是一个 Promise
 * @param activeWhen 一个函数或者字符串，用于判断应用是否激活
 * @param customProps 一个对象，用于传递自定义属性
 * @returns {Object} 返回格式化后的注册应用参数，例如 { name: 'app1', app: loadApp, activeWhen, customProps }
 */
function sanitizeArguments(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  // registerApplication 的参数可以是两种形式：
  // 1. 函数 API: single-spa.registerApplication(name, loadApp, activeWhen, customProps);
  // 2. 对象 API: single-spa.registerApplication({ name: 'app1', app: loadApp, activeWhen, customProps });

  // 如果 appNameOrConfig 是一个对象，表示使用对象 API
  const usingObjectAPI = typeof appNameOrConfig === "object";

  const registration = {
    name: null,
    loadApp: null,
    activeWhen: null,
    customProps: null,
  };

  // 如果使用对象 API，那么 appNameOrConfig 就是一个对象
  if (usingObjectAPI) {
    // 对 registerApplication 的首个参数进行格式校验（其余三个参数不需要校验）
    // 1. name 必须是字符串
    // 2. app 必须是对象或者函数
    // 3. activeWhen 必须是函数或者字符串
    // 4. customProps 必须是对象
    validateRegisterWithConfig(appNameOrConfig);
    registration.name = appNameOrConfig.name;
    registration.loadApp = appNameOrConfig.app;
    registration.activeWhen = appNameOrConfig.activeWhen;
    registration.customProps = appNameOrConfig.customProps;

    // 如果使用函数 API，那么 appNameOrConfig 是一个字符串
  } else {
    // 对 registerApplication 的四个参数进行格式校验
    validateRegisterWithArguments(
      appNameOrConfig,
      appOrLoadApp,
      activeWhen,
      customProps
    );
    registration.name = appNameOrConfig;
    registration.loadApp = appOrLoadApp;
    registration.activeWhen = activeWhen;
    registration.customProps = customProps;
  }

  // 对注册应用的 loadApp 参数进行格式化，统一为一个返回 Promise 的函数
  registration.loadApp = sanitizeLoadApp(registration.loadApp);
  // 对注册应用的 customProps 参数进行格式化，如果没有传递，则默认为空对象
  registration.customProps = sanitizeCustomProps(registration.customProps);
  // 对注册应用的 activeWhen 参数进行格式化，统一为一个函数
  registration.activeWhen = sanitizeActiveWhen(registration.activeWhen);

  return registration;
}

/**
 * @description 对注册应用的 loadApp 参数进行格式化，统一为一个返回 Promise 的函数
 * @param loadApp 应用对象或者加载应用的函数，返回值是一个 Promise
 * @returns {Function} 返回一个返回 Promise 的函数
 */
function sanitizeLoadApp(loadApp) {
  // 如果 loadApp 是一个对象，转化成一个返回 Promise 的函数
  // 例如：{ bootstrap, mount, unmount } => () => Promise.resolve({ bootstrap, mount, unmount })
  if (typeof loadApp !== "function") {
    return () => Promise.resolve(loadApp);
  }

  // 如果 loadApp 是一个函数，直接返回 loadApp
  return loadApp;
}

/**
 * @description 对注册应用的 customProps 参数进行格式化，如果没有传递，则默认为空对象
 * @param customProps 一个对象，用于传递自定义属性
 * @returns {Object} 返回格式化后的 customProps 参数
 */
function sanitizeCustomProps(customProps) {
  return customProps ? customProps : {};
}

/**
 * @description 对注册应用的 activeWhen 参数进行格式化，统一为一个函数
 * @param activeWhen 一个函数或者字符串，用于判断应用是否激活
 * @returns {Function} 返回匹配路由的函数
 */
function sanitizeActiveWhen(activeWhen) {
  // 如果 activeWhen 不是数组，转化成数组
  let activeWhenArray = Array.isArray(activeWhen) ? activeWhen : [activeWhen];
  // 对 activeWhen 数组中的每一项进行格式化，统一为一个函数
  activeWhenArray = activeWhenArray.map((activeWhenOrPath) =>
    typeof activeWhenOrPath === "function"
      ? activeWhenOrPath
      : // 如果 activeWhenOrPath 是字符串，转化成一个函数
        pathToActiveWhen(activeWhenOrPath)
  );

  return (location) =>
    // 判断当前路由是否匹配 activeWhenArray 数组中的任意一项
    activeWhenArray.some((activeWhen) => activeWhen(location));
}

/**
 * @description 对 path 进行格式化，统一为一个匹配路由的函数
 * @export
 * @param path 一个字符串，用于匹配路由
 * @param exactMatch 一个布尔值，用于判断是否精确匹配
 * @returns {Function} 返回匹配路由的函数
 */
export function pathToActiveWhen(path, exactMatch) {
  // 根据 path 和 exactMatch 参数，动态组装需要匹配路由的正则表达式
  const regex = toDynamicPathValidatorRegex(path, exactMatch);

  return (location) => {
    // compatible with IE10
    let origin = location.origin;
    if (!origin) {
      origin = `${location.protocol}//${location.host}`;
    }
    // 判断当前路由是否匹配 path
    // 1. location.href: http://localhost:8080/react/path/to/something?name=123#/home
    // 2. location.origin: http://localhost:8080
    // 3. location.search: ?name=123
    // 4. location.hash: #/home
    // 5. route: /react/path/to/something
    const route = location.href
      .replace(origin, "")
      .replace(location.search, "")
      .split("?")[0];
    return regex.test(route);
  };
}

/**
 * @description 根据 path 和 exactMatch 参数，动态组装需要匹配路由的正则表达式
 *
 * @example
 * toDynamicPathValidatorRegex("/react") => /^\/react(\/.*)?(#.*)?$/i
 *
 * 正则：
 * /^\/react(\/.*)?(#.*)?$/i
 *
 * 详细说明：
 * 1. ^：匹配输入的开始
 * 2. \/react：匹配字符串 /react
 * 3. (\/.*)?：匹配零次或一次以 / 开头的任意字符串
 * 4. (#.*)?：匹配零次或一次以 # 开头的任意字符串，例如 hash 路由
 * 5. $：匹配输入的结束
 * 6. i：不区分大小写
 *
 * 匹配示例：
 * 1. /react
 * 2. /react/path/to/something
 * 3. /react#hash
 * 4. /react/path/to/something#hash
 *
 * @example
 * toDynamicPathValidatorRegex("/react/:id") => /^\/react\/[^/]+\/?/i
 *
 * 正则：
 * /^\/react\/[^/]+\/?/i
 *
 * 详细说明：
 * 1. ^：匹配输入的开始
 * 2. \/react\/：匹配字符串 /react/
 * 3. [^/]+：匹配一次或多次不包含 / 的任意字符，可以匹配 /react/ 后面的一段路径
 * 4. \/?：匹配零次或一次 /，可以匹配路径的结束 / 或者没有结束 /
 * 5. i：不区分大小写
 *
 * 匹配示例：
 * 1. /react/123
 * 2. /react/123/
 * 3. /react/123/path/to/something
 * 4. /react/123/path/to/something/
 * 5. /react/123#hash
 * 6. /react/123#hash/
 *
 * @param path 一个字符串，用于匹配路由
 * @param exactMatch 一个布尔值，用于判断是否精确匹配
 * @returns {RegExp} 返回匹配路由的正则表达式
 */

function toDynamicPathValidatorRegex(path, exactMatch) {
  let lastIndex = 0,
    inDynamic = false,
    regexStr = "^";

  if (path[0] !== "/") {
    path = "/" + path;
  }

  // 遍历 path，判断 path 中是否包含动态路由
  for (let charIndex = 0; charIndex < path.length; charIndex++) {
    const char = path[charIndex];
    const startOfDynamic = !inDynamic && char === ":";
    const endOfDynamic = inDynamic && char === "/";
    if (startOfDynamic || endOfDynamic) {
      // 如果 path 中包含动态路由，那么 inDynamic 为 true
      appendToRegex(charIndex);
    }
  }

  appendToRegex(path.length);
  return new RegExp(regexStr, "i");

  function appendToRegex(index) {
    const anyCharMaybeTrailingSlashRegex = "[^/]+/?";
    // escapeStrRegex 函数用于转义字符串中的特殊字符
    const commonStringSubPath = escapeStrRegex(path.slice(lastIndex, index));

    regexStr += inDynamic
      ? anyCharMaybeTrailingSlashRegex
      : commonStringSubPath;

    if (index === path.length) {
      if (inDynamic) {
        if (exactMatch) {
          // Ensure exact match paths that end in a dynamic portion don't match
          // urls with characters after a slash after the dynamic portion.
          regexStr += "$";
        }
      } else {
        // For exact matches, expect no more characters. Otherwise, allow
        // any characters.
        const suffix = exactMatch ? "" : ".*";

        regexStr =
          // use charAt instead as we could not use es6 method endsWith
          regexStr.charAt(regexStr.length - 1) === "/"
            ? `${regexStr}${suffix}$`
            : `${regexStr}(/${suffix})?(#.*)?$`;
      }
    }

    inDynamic = !inDynamic;
    lastIndex = index;
  }

  function escapeStrRegex(str) {
    // borrowed from https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  }
}
