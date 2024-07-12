/**
 * @author Kuitos
 * @since 2020-04-01
 */
import { importEntry } from 'import-html-entry';
import { concat, forEach, mergeWith } from 'lodash';
import getAddOns from './addons';
import { QiankunError } from './error';
import { getMicroAppStateActions } from './globalState';
import { createSandboxContainer, css } from './sandbox';
import { cachedGlobals } from './sandbox/proxySandbox';
import {
  Deferred,
  genAppInstanceIdByName,
  getContainer,
  getDefaultTplWrapper,
  getWrapperId,
  isEnableScopedCSS,
  performanceGetEntriesByName,
  performanceMark,
  performanceMeasure,
  toArray,
  validateExportLifecycle,
} from './utils';
function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new QiankunError(msg);
    }
    throw new QiankunError('element not existed!');
  }
}
function execHooksChain(hooks, app, global = window) {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app, global)), Promise.resolve());
  }
  return Promise.resolve();
}
async function validateSingularMode(validate, app) {
  return typeof validate === 'function' ? validate(app) : !!validate;
}
const supportShadowDOM = !!document.head.attachShadow || !!document.head.createShadowRoot;

// 1. appContent: 微应用的模板内容，包含了所有内联 CSS 样式的内容
// 2. strictStyleIsolation: 严格样式隔离，用于隔离微应用的样式，避免样式冲突，默认为 false
// 3. scopedCSS: 是否启用 scoped CSS，用于隔禩微应用的样式，避免样式冲突，默认为 false
// 4. appInstanceId: 应用实例 id，用于标记应用, 例如 vue、react、vue_1、react_1 等
function createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId) {
  // 创建一个 div 元素
  const containerElement = document.createElement('div');
  // 将微应用的模板内容设置到 div 元素中
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div
  // 在微应用的模板外层包裹一个 div 元素，表明微应用信息、框架版本号、是否启用沙箱隔离等
  // 这里的 containerElement.firstChild 就是这个 div 元素
  const appElement = containerElement.firstChild;
  // 如果启用了严格样式隔离
  if (strictStyleIsolation) {
    // 如果浏览器不支持 shadow dom，则打印警告信息
    if (!supportShadowDOM) {
      console.warn(
        '[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!',
      );
      // 如果浏览器支持 shadow dom，则将微应用的内容包裹在 shadow dom 中
    } else {
      const { innerHTML } = appElement;
      appElement.innerHTML = '';
      let shadow;
      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({ mode: 'open' });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = appElement.createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
  }
  // 如果启用了 scoped CSS
  if (scopedCSS) {
    // 获取 appElement 元素上的 qiankun 属性
    const attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
    if (!attr) {
      appElement.setAttribute(css.QiankunCSSRewriteAttr, appInstanceId);
    }
    // 获取 appElement 元素上的 style 标签
    // 因为已经通过 import-html-entry 获取了所有的内联 CSS 样式，所以这里只需要处理 style 标签
    const styleNodes = appElement.querySelectorAll('style') || [];
    forEach(styleNodes, (stylesheetElement) => {
      // 通过 css.process 方法处理 style 标签的内容
      css.process(appElement, stylesheetElement, appInstanceId);
    });
  }
  // 注意这里返回的是 appElement，而不是 containerElement
  // appElement 是微应用的内容，containerElement 是包裹微应用内容的 div 元素
  return appElement;
}
/** generate app wrapper dom getter */
function getAppWrapperGetter(appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
  return () => {
    // 如果使用了 legacy render，则直接获取 id 为 appInstanceId 的元素
    if (useLegacyRender) {
      // 如果启用了严格样式隔离，则抛出异常
      if (strictStyleIsolation) throw new QiankunError('strictStyleIsolation can not be used with legacy render!');
      // 如果启用了 scoped CSS，则抛出异常
      if (scopedCSS) throw new QiankunError('experimentalStyleIsolation can not be used with legacy render!');
      // 获取 qiankun 包装的 div 元素，用于包裹微应用的内容，包含了 id、版本号、是否启用沙箱隔离等信息
      const appWrapper = document.getElementById(getWrapperId(appInstanceId));
      // 判断 appWrapper 是否存在，如果不存在则抛出异常
      assertElementExist(appWrapper, `Wrapper element for ${appInstanceId} is not existed!`);
      // 返回 appWrapper
      return appWrapper;
    }
    // 如果没有使用 legacy render，则通过 elementGetter 获取元素
    // 外部其实是  () => initialAppWrapperElement
    const element = elementGetter();
    // 判断 element 是否存在，如果不存在则抛出异常
    assertElementExist(element, `Wrapper element for ${appInstanceId} is not existed!`);
    // 如果启用了严格样式隔离，则返回 shadowRoot
    if (strictStyleIsolation && supportShadowDOM) {
      return element.shadowRoot;
    }
    // 否则返回 element
    return element;
  };
}
const rawAppendChild = HTMLElement.prototype.appendChild;
const rawRemoveChild = HTMLElement.prototype.removeChild;
/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appInstanceId
 * @param appContent
 * @param legacyRender
 */
function getRender(appInstanceId, appContent, legacyRender) {
  const render = ({ element, loading, container }, phase) => {
    // 如果提供了 legacyRender 函数，则使用 legacyRender 函数
    if (legacyRender) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          '[qiankun] Custom rendering function is deprecated and will be removed in 3.0, you can use the container element setting instead!',
        );
      }
      return legacyRender({ loading, appContent: element ? appContent : '' });
    }
    // 获取容器元素
    const containerElement = getContainer(container);
    // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed
    // 容器元素可能在微应用卸载后被移除
    if (phase !== 'unmounted') {
      const errorMsg = (() => {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return `Target container with ${container} not existed while ${appInstanceId} ${phase}!`;
          case 'mounted':
            return `Target container with ${container} not existed after ${appInstanceId} ${phase}!`;
          default:
            return `Target container with ${container} not existed while ${appInstanceId} rendering!`;
        }
      })();
      // 判断容器元素是否存在，如果不存在则抛出异常
      assertElementExist(containerElement, errorMsg);
    }
    // 如果容器元素存在，但是 element 不存在，则表示当前应用正在加载中
    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      // 移除容器元素中的所有子元素
      while (containerElement.firstChild) {
        rawRemoveChild.call(containerElement, containerElement.firstChild);
      }
      // append the element to container if it exist
      // 如果 element 存在，则将 element 添加到容器元素中
      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }
    return undefined;
  };
  // 返回 render 函数
  return render;
}
function getLifecyclesFromExports(scriptExports, appName, global, globalLatestSetProp) {
  // 校验 bootstrap、mount、unmount 是否存在并且是函数
  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }
  // fallback to sandbox latest set property if it had
  // 如果没有找到生命周期函数，则尝试从沙箱的 latestSetProp 属性中获取
  if (globalLatestSetProp) {
    const lifecycles = global[globalLatestSetProp];
    if (validateExportLifecycle(lifecycles)) {
      return lifecycles;
    }
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[qiankun] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`,
    );
  }
  // fallback to global variable who named with ${appName} while module exports not found
  // 如果没有找到生命周期函数，则尝试从全局变量中获取 appName 对应的属性
  const globalVariableExports = global[appName];
  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }
  // 如果还是没有找到生命周期函数，则抛出异常
  throw new QiankunError(`You need to export lifecycle functions in ${appName} entry`);
}
let prevAppUnmountedDeferred;
export async function loadApp(app, configuration = {}, lifeCycles) {
  // 获取 app 的 entry 和 name
  const { entry, name: appName } = app;
  // 生成 app 实例 id，用于标记 app，例如 vue、react、vue_1、react_1 等
  const appInstanceId = genAppInstanceIdByName(appName);
  // 例如 vue 微应用：[qiankun] App vue Loading
  const markName = `[qiankun] App ${appInstanceId} Loading`;
  if (process.env.NODE_ENV === 'development') {
    // 如果浏览器支持 performance API，则记录 mark
    // 用于记录应用加载的开始时间
    performanceMark(markName);
  }
  // importEntryOpts 为 import-html-entry 的配置项
  // 例如 fetch、getTemplate、getPublicPath、postProcessHtml 等
  const {
    singular = false,
    sandbox = true,
    excludeAssetFilter,
    globalContext = window,
    ...importEntryOpts
  } = configuration;
  // get the entry html content and script executor
  // 获取微应用的模板、执行脚本、资源公共路径、获取外部脚本等
  const { template, execScripts, assetPublicPath, getExternalScripts } = await importEntry(entry, importEntryOpts);
  // trigger external scripts loading to make sure all assets are ready before execScripts calling
  // 等待微应用的外部脚本加载完成
  await getExternalScripts();
  // as single-spa load and bootstrap new app parallel with other apps unmounting
  // (see https://github.com/CanopyTax/single-spa/blob/master/src/navigation/reroute.js#L74)
  // we need wait to load the app until all apps are finishing unmount in singular mode
  // 如果是单实例模式，需要等待上一个应用卸载完成后再加载当前应用
  if (await validateSingularMode(singular, app)) {
    await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
  }
  // 1. appInstanceId: 应用实例 id，用于标记应用, 例如 vue、react、vue_1、react_1 等
  // 2. sandbox: 沙箱配置，用于隔离微应用的全局变量，默认为 true
  // 3. template: 微应用的模板，包含了所有内联 CSS 样式的内容，已经在 import-html-entry 源码分析中讲解

  // getDefaultTplWrapper 方法用于获取默认的模板包裹器
  // 1. qiankun 会在微应用的模板外层包裹一个 div 元素，表明微应用信息、框架版本号、是否启用沙箱隔离等
  // 2. qiankun 会将原始的 <head> 标签替换为 <qiankun-head> 标签
  const appContent = getDefaultTplWrapper(appInstanceId, sandbox)(template);
  // 是否启用严格样式隔离
  // strictStyleIsolation: 严格样式隔离，用于隔离微应用的样式，避免样式冲突，默认为 false，通过外部配置项传入
  const strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
  if (process.env.NODE_ENV === 'development' && strictStyleIsolation) {
    console.warn(
      "[qiankun] strictStyleIsolation configuration will be removed in 3.0, pls don't depend on it or use experimentalStyleIsolation instead!",
    );
  }
  // 是否启用 scoped CSS
  const scopedCSS = isEnableScopedCSS(sandbox);
  // 处理严格样式隔离和 scoped CSS
  let initialAppWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
  // 获取微应用的容器
  const initialContainer = 'container' in app ? app.container : undefined;
  // 判断 app 是否有 render 方法
  const legacyRender = 'render' in app ? app.render : undefined;
  const render = getRender(appInstanceId, appContent, legacyRender);
  // 第一次加载设置应用可见区域 dom 结构
  // 确保每次应用加载前容器 dom 结构已经设置完毕

  // React 或者 Vue 微应用执行脚本时会通过 React.createElement 或者 Vue.createApp 方法创建应用实例
  // 这些实例最终会被挂载到对应的 HTML 模板的根元素上，例如 React 会挂载到 id 为 root 的 div 元素上，Vue 会挂载到 id 为 app 的 div 元素上
  // 这里的 render 就是将处理完微应用的 HTML 模板插入到容器元素中，确保容器 dom 结构已经设置完毕
  render({ element: initialAppWrapperElement, loading: true, container: initialContainer }, 'loading');
  // 该函数用于获取 app 的容器
  const initialAppWrapperGetter = getAppWrapperGetter(
    // 生成 app 实例 id，用于标记 app，例如 vue、react、vue_1、react_1 等
    appInstanceId,
    // 是否使用 legacy render
    !!legacyRender,
    // 是否启用严格样式隔离
    strictStyleIsolation,
    // 是否启用 scoped CSS
    scopedCSS,
    // 获取 app 的容器
    () => initialAppWrapperElement,
  );
  // 缓存主应用运行时的全局对象
  let global = globalContext;
  // 初始化沙箱
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  // 是否使用松散沙箱
  const useLooseSandbox = typeof sandbox === 'object' && !!sandbox.loose;
  // enable speedy mode by default
  // 是否启用 speedy 模式, 默认为 true
  const speedySandbox = typeof sandbox === 'object' ? sandbox.speedy !== false : true;
  let sandboxContainer;
  // 如果启用了沙箱
  if (sandbox) {
    // 创建沙箱容器
    sandboxContainer = createSandboxContainer(
      // 生成 app 实例 id，用于标记 app，例如 vue、react、vue_1、react_1 等
      appInstanceId,
      // 该函数用于获取 app 的容器
      // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
      initialAppWrapperGetter,
      // 是否启用 scoped CSS
      scopedCSS,
      // 是否使用松散沙箱
      useLooseSandbox,
      // 排除资源过滤器
      excludeAssetFilter,
      // 主应用运行时的全局对象
      global,
      // 是否启用 speedy 沙箱
      speedySandbox,
    );
    // 用沙箱的代理对象作为接下来使用的全局对象
    global = sandboxContainer.instance.proxy;
    mountSandbox = sandboxContainer.mount;
    unmountSandbox = sandboxContainer.unmount;
  }
  const {
    beforeUnmount = [],
    afterUnmount = [],
    afterMount = [],
    beforeMount = [],
    beforeLoad = [],
  } = mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, (v1, v2) => concat(v1 ?? [], v2 ?? []));
  // 批量执行 beforeLoad 钩子
  await execHooksChain(toArray(beforeLoad), app, global);
  // get the lifecycle hooks from module exports
  // 执行微应用的脚本，传入隔离的全局对象 proxy
  // 此时会触发大量的 proxy 代理逻辑，包括 get 和 set 操作

  // 这里会通过 proxy 的 set 和 get 触发设置和获取隔离在 fakeWindow 上的微应用周期函数
  const scriptExports = await execScripts(global, sandbox && !useLooseSandbox, {
    scopedGlobalVariables: speedySandbox ? cachedGlobals : [],
  });
  // 获取微应用的生命周期函数
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    scriptExports,
    appName,
    global,
    // 通过 proxy 的 set 记录最后一次设置的属性
    sandboxContainer?.instance?.latestSetProp,
  );
  const { onGlobalStateChange, setGlobalState, offGlobalStateChange } = getMicroAppStateActions(appInstanceId);
  // FIXME temporary way
  const syncAppWrapperElement2Sandbox = (element) => (initialAppWrapperElement = element);
  const parcelConfigGetter = (remountContainer = initialContainer) => {
    let appWrapperElement;
    let appWrapperGetter;
    // single-spa 需要的注册参数
    const parcelConfig = {
      name: appInstanceId,
      bootstrap,
      mount: [
        async () => {
          // 如果在开发态，且当前环境支持 performance API，则记录 mark
          if (process.env.NODE_ENV === 'development') {
            const marks = performanceGetEntriesByName(markName, 'mark');
            // mark length is zero means the app is remounting
            if (marks && !marks.length) {
              performanceMark(markName);
            }
          }
        },
        async () => {
          // 如果是单实例模式并且当前应用的卸载标记存在，则等待当前应用卸载完成
          if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
            return prevAppUnmountedDeferred.promise;
          }
          return undefined;
        },
        // initial wrapper element before app mount/remount
        async () => {
          // 包含了 id、版本号、是否启用沙箱隔离等信息的 div 容器元素
          appWrapperElement = initialAppWrapperElement;
          // 该函数用于获取 app 的容器
          appWrapperGetter = getAppWrapperGetter(
            appInstanceId,
            !!legacyRender,
            strictStyleIsolation,
            scopedCSS,
            () => appWrapperElement,
          );
        },
        // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
        async () => {
          const useNewContainer = remountContainer !== initialContainer;
          // 如果使用了新的容器或者 appWrapperElement 不存在，则重新创建 appWrapperElement
          if (useNewContainer || !appWrapperElement) {
            // element will be destroyed after unmounted, we need to recreate it if it not exist
            // or we try to remount into a new container
            // 元素将在卸载后被销毁，如果不存在则需要重新创建
            // 或者尝试重新挂载到新的容器中

            // 重新创建 appWrapperElement
            appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
            // 将 appWrapperElement 赋值给 initialAppWrapperElement
            syncAppWrapperElement2Sandbox(appWrapperElement);
          }
          render({ element: appWrapperElement, loading: true, container: remountContainer }, 'mounting');
        },
        // 启动沙箱
        mountSandbox,
        // exec the chain after rendering to keep the behavior with beforeLoad
        // 执行微应用的 beforeMount 钩子
        async () => execHooksChain(toArray(beforeMount), app, global),
        // 执行微应用的 mount 钩子
        async (props) => mount({ ...props, container: appWrapperGetter(), setGlobalState, onGlobalStateChange }),
        // finish loading after app mounted
        async () => render({ element: appWrapperElement, loading: false, container: remountContainer }, 'mounted'),
        // 执行微应用的 afterMount 钩子
        async () => execHooksChain(toArray(afterMount), app, global),
        // initialize the unmount defer after app mounted and resolve the defer after it unmounted
        async () => {
          // 如果是单实例模式，标记当前应用是否已经卸载
          if (await validateSingularMode(singular, app)) {
            // 在应用 mount 完成后，标记当前应用还没有卸载
            // 此时如果激活了微应用进入 loadApp 函数，会等待当前应用卸载完成后再加载
            prevAppUnmountedDeferred = new Deferred();
          }
        },
        async () => {
          // 如果在开发态，且当前环境支持 performance API，则记录 measure
          if (process.env.NODE_ENV === 'development') {
            const measureName = `[qiankun] App ${appInstanceId} Loading Consuming`;
            performanceMeasure(measureName, markName);
          }
        },
      ],
      unmount: [
        // 执行微应用的 beforeUnmount 钩子
        async () => execHooksChain(toArray(beforeUnmount), app, global),
        // 执行微应用的 unmount 钩子
        async (props) => unmount({ ...props, container: appWrapperGetter() }),
        // 卸载沙箱
        unmountSandbox,
        // 执行微应用的 afterUnmount 钩子
        async () => execHooksChain(toArray(afterUnmount), app, global),
        async () => {
          // 移除 appWrapperElement
          render({ element: null, loading: false, container: remountContainer }, 'unmounted');
          offGlobalStateChange(appInstanceId);
          // for gc
          appWrapperElement = null;
          syncAppWrapperElement2Sandbox(appWrapperElement);
        },
        async () => {
          // 如果是单例模式并且当前应用的卸载标记存在，则标记当前应用已经卸载
          if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
            // 通过 Promise.resolve 方法标记当前应用已经卸载
            // 在 loadApp 函数中会结束等待当前应用卸载的 Promise
            // 确保在单例模式下，当前应用卸载完成后再加载下一个应用
            prevAppUnmountedDeferred.resolve();
          }
        },
      ],
    };
    if (typeof update === 'function') {
      parcelConfig.update = update;
    }
    return parcelConfig;
  };
  return parcelConfigGetter;
}
