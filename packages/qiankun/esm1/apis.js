import { noop } from 'lodash';
import { mountRootParcel, registerApplication, start as startSingleSpa } from 'single-spa';
import { loadApp } from './loader';
import { doPrefetchStrategy } from './prefetch';
import { Deferred, getContainerXPath, isConstDestructAssignmentSupported, toArray } from './utils';
let microApps = [];
export let frameworkConfiguration = {};
let started = false;
const defaultUrlRerouteOnly = true;
const frameworkStartedDefer = new Deferred();
// 用于降级处理低版本浏览器的兼容性问题
const autoDowngradeForLowVersionBrowser = (configuration) => {
  // 1. sandbox 为 true 时，表示启用沙箱
  // 2. singular 为  true 时，表示单实例场景，单实例指的是同一时间只会渲染一个微应用
  const { sandbox = true, singular } = configuration;
  // 如果启用沙箱
  if (sandbox) {
    // 如果浏览器不支持 window.Proxy，则降级为 snapshotSandbox  沙箱
    if (!window.Proxy) {
      console.warn('[qiankun] Missing window.Proxy, proxySandbox will degenerate into snapshotSandbox');
      // 如果 singular 为 false，表明不是单实例场景
      // snapshotSandbox 沙箱只支持单实例场景，所以这里给出警告
      if (singular === false) {
        console.warn(
          '[qiankun] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy',
        );
      }
      // loose 设置为 true
      return { ...configuration, sandbox: typeof sandbox === 'object' ? { ...sandbox, loose: true } : { loose: true } };
    }

    // 1. 浏览器不支持 const destruct assignment
    // 2. sandbox 为 true 或者 sandbox.speedy 为 true
    if (
      !isConstDestructAssignmentSupported() &&
      (sandbox === true || (typeof sandbox === 'object' && sandbox.speedy !== false))
    ) {
      console.warn(
        '[qiankun] Speedy mode will turn off as const destruct assignment not supported in current browser!',
      );
      // speedy 设置为 false
      return {
        ...configuration,
        sandbox: typeof sandbox === 'object' ? { ...sandbox, speedy: false } : { speedy: false },
      };
    }
  }
  return configuration;
};
export function registerMicroApps(apps, lifeCycles) {
  // Each app only needs to be registered once
  // 过滤掉已经注册过的 app
  const unregisteredApps = apps.filter((app) => !microApps.some((registeredApp) => registeredApp.name === app.name));
  // 将未注册的 app 加入到 microApps 中
  microApps = [...microApps, ...unregisteredApps];
  // 遍历未注册的 app，将其注册到 single-spa 中
  unregisteredApps.forEach((app) => {
    // 解构 app 对象，获取 name、activeRule、loader、props 等属性
    // 1. activeRule 用于判断当前路由是否匹配当前微前端应用，对应 single-spa 的 activeWhen 属性
    // 2. loader 用于在微前端应用加载时显示 loading 状态，默认是一个空函数
    // 3. props 用于传递给微前端应用的 props，在 single-spa 中对应 customProps 属性
    // 4. appConfig 用于传递给 loadApp 方法的参数，例如 entry、container、sandbox、excludeAssetFilter 等
    const { name, activeRule, loader = noop, props, ...appConfig } = app;
    // single-spa 的 registerApplication 方法用于注册一个微前端应用
    registerApplication({
      name,
      // async 函数，返回一个 Promise
      // app 参数用于加载微前端应用，返回值是一个对象，包含了微前端应用的生命周期函数
      app: async () => {
        // 显示 loading 状态，表明微前端应用正在加载中
        loader(true);
        // 等待 frameworkStartedDefer 的 Promise 对象 resolve 后再继续执行
        // frameworkStartedDefer 的 Promise 对象是在 start 方法中 resolve 的
        // 也就是说，只有在 start 方法执行后，才会继续执行下面的代码
        // 这样做是为了保证微前端应用的加载是在 start 方法执行后进行的
        await frameworkStartedDefer.promise;
        //  执行 loadApp 加载微应用并返回微应用的生命周期函数
        const { mount, ...otherMicroAppConfigs } =
          // lifeCycles 是一个对象，是生命周期函数的 hook，例如 beforeLoad、beforeMount 等
          (await loadApp({ name, props, ...appConfig }, frameworkConfiguration, lifeCycles))();
        return {
          mount: [async () => loader(true), ...toArray(mount), async () => loader(false)],
          ...otherMicroAppConfigs,
        };
      },
      activeWhen: activeRule,
      customProps: props,
    });
  });
}
const appConfigPromiseGetterMap = new Map();
const containerMicroAppsMap = new Map();
export function loadMicroApp(app, configuration, lifeCycles) {
  const { props, name } = app;
  const container = 'container' in app ? app.container : undefined;
  // Must compute the container xpath at beginning to keep it consist around app running
  // If we compute it every time, the container dom structure most probably been changed and result in a different xpath value
  const containerXPath = getContainerXPath(container);
  const appContainerXPathKey = `${name}-${containerXPath}`;
  let microApp;
  const wrapParcelConfigForRemount = (config) => {
    let microAppConfig = config;
    if (container) {
      if (containerXPath) {
        const containerMicroApps = containerMicroAppsMap.get(appContainerXPathKey);
        if (containerMicroApps?.length) {
          const mount = [
            async () => {
              // While there are multiple micro apps mounted on the same container, we must wait until the prev instances all had unmounted
              // Otherwise it will lead some concurrent issues
              const prevLoadMicroApps = containerMicroApps.slice(0, containerMicroApps.indexOf(microApp));
              const prevLoadMicroAppsWhichNotBroken = prevLoadMicroApps.filter(
                (v) => v.getStatus() !== 'LOAD_ERROR' && v.getStatus() !== 'SKIP_BECAUSE_BROKEN',
              );
              await Promise.all(prevLoadMicroAppsWhichNotBroken.map((v) => v.unmountPromise));
            },
            ...toArray(microAppConfig.mount),
          ];
          microAppConfig = {
            ...config,
            mount,
          };
        }
      }
    }
    return {
      ...microAppConfig,
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: () => Promise.resolve(),
    };
  };
  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */
  const memorizedLoadingFn = async () => {
    const userConfiguration = autoDowngradeForLowVersionBrowser(
      configuration ?? { ...frameworkConfiguration, singular: false },
    );
    const { $$cacheLifecycleByAppName } = userConfiguration;
    if (container) {
      // using appName as cache for internal experimental scenario
      if ($$cacheLifecycleByAppName) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);
        if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }
      if (containerXPath) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(appContainerXPathKey);
        if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }
    }
    const parcelConfigObjectGetterPromise = loadApp(app, userConfiguration, lifeCycles);
    if (container) {
      if ($$cacheLifecycleByAppName) {
        appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
      } else if (containerXPath) appConfigPromiseGetterMap.set(appContainerXPathKey, parcelConfigObjectGetterPromise);
    }
    return (await parcelConfigObjectGetterPromise)(container);
  };
  if (!started && configuration?.autoStart !== false) {
    // We need to invoke start method of single-spa as the popstate event should be dispatched while the main app calling pushState/replaceState automatically,
    // but in single-spa it will check the start status before it dispatch popstate
    // see https://github.com/single-spa/single-spa/blob/f28b5963be1484583a072c8145ac0b5a28d91235/src/navigation/navigation-events.js#L101
    // ref https://github.com/umijs/qiankun/pull/1071
    startSingleSpa({ urlRerouteOnly: frameworkConfiguration.urlRerouteOnly ?? defaultUrlRerouteOnly });
  }
  microApp = mountRootParcel(memorizedLoadingFn, { domElement: document.createElement('div'), ...props });
  if (container) {
    if (containerXPath) {
      // Store the microApps which they mounted on the same container
      const microAppsRef = containerMicroAppsMap.get(appContainerXPathKey) || [];
      microAppsRef.push(microApp);
      containerMicroAppsMap.set(appContainerXPathKey, microAppsRef);
      const cleanup = () => {
        const index = microAppsRef.indexOf(microApp);
        microAppsRef.splice(index, 1);
        // @ts-ignore
        microApp = null;
      };
      // gc after unmount
      microApp.unmountPromise.then(cleanup).catch(cleanup);
    }
  }
  return microApp;
}
export function start(opts = {}) {
  // 1. prefetch: true 表示在注册微应用时，预加载微应用的资源（qiankun start 方法的 opts）
  // 2. singular: true 单实例场景，单实例指的是同一时间只会渲染一个微应用（import-html-entry 的 opts）
  // 3. sandbox: true 表示启用沙箱，沙箱是一个隔离环境，用于隔离微应用的全局变量（import-html-entry 的 opts）
  // 4. fetch: 自定义 fetch 方法（import-html-entry 的 opts）
  // 5. getPublicPath: 自定义获取 publicPath 的方法（import-html-entry 的 opts）
  // 6. getTemplate: 自定义获取模板的方法（import-html-entry 的 opts）
  // 7. excludeAssetFilter: 自定义排除资源的方法（import-html-entry 的 opts）
  // 8. urlRerouteOnly: true 表示只有在 url 发生变化时，才会触发路由变化（single-spa start 方法的 opts）
  frameworkConfiguration = { prefetch: true, singular: true, sandbox: true, ...opts };
  const { prefetch, urlRerouteOnly = defaultUrlRerouteOnly, ...importEntryOpts } = frameworkConfiguration;
  // 如果 prefetch 为 true，则执行 doPrefetchStrategy 方法，预加载微应用的资源
  if (prefetch) {
    // 预加载微应用的资源
    doPrefetchStrategy(microApps, prefetch, importEntryOpts);
  }
  // 降级处理低版本浏览器的兼容性问题，返回处理后的沙箱配置
  frameworkConfiguration = autoDowngradeForLowVersionBrowser(frameworkConfiguration);
  // 启动 single-spa
  startSingleSpa({ urlRerouteOnly });
  // 标识 qiankun 已经启动
  started = true;
  // 只有在 start 方法执行后，才会 resolve frameworkStartedDefer 的 Promise 对象
  // 因此只有在 start 方法执行后，才会执行 registerMicroApps 方法中的 await frameworkStartedDefer.promise
  // 确保 start 执行才会执行 single-spa 注册微应用的 app 参数，执行微应用的加载逻辑
  frameworkStartedDefer.resolve();
}
