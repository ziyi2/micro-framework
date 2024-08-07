/**
 * @author Kuitos
 * @since 2020-04-01
 */

import { importEntry } from 'import-html-entry';
import { concat, forEach, mergeWith } from 'lodash';
import type { LifeCycles, ParcelConfigObject } from 'single-spa';
import getAddOns from './addons';
import { QiankunError } from './error';
import { getMicroAppStateActions } from './globalState';
import type {
  FrameworkConfiguration,
  FrameworkLifeCycles,
  HTMLContentRender,
  LifeCycleFn,
  LoadableApp,
  ObjectType,
} from './interfaces';
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

function assertElementExist(element: Element | null | undefined, msg?: string) {
  if (!element) {
    if (msg) {
      throw new QiankunError(msg);
    }

    throw new QiankunError('element not existed!');
  }
}

function execHooksChain<T extends ObjectType>(
  hooks: Array<LifeCycleFn<T>>,
  app: LoadableApp<T>,
  global = window,
): Promise<any> {
  // hooks 是一个数组，数组中的每一项都是一个钩子函数
  if (hooks.length) {
    // 批量执行 hooks 中的函数
    // 每一个 hook 都是异步函数，返回 Promise
    // 下一个 hook 的执行依赖于上一个 hook 执行完成
    return hooks.reduce((chain, hook) => chain.then(() => hook(app, global)), Promise.resolve());
  }

  return Promise.resolve();
}

async function validateSingularMode<T extends ObjectType>(
  validate: FrameworkConfiguration['singular'],
  app: LoadableApp<T>,
): Promise<boolean> {
  // validate 即是 singular，可以是 boolean 或者 function
  // singular 由 start 方法的配置传入
  // 详见：https://qiankun.umijs.org/zh/api#startopts
  return typeof validate === 'function' ? validate(app) : !!validate;
}

const supportShadowDOM = !!document.head.attachShadow || !!(document.head as any).createShadowRoot;

// appContent: 微应用的字符串内容
// strictStyleIsolation: 是否启用严格样式隔离
// scopedCSS: 是否启用 Scoped 样式隔离
// appInstanceId: app 实例 id，例如 vue
function createElement(
  appContent: string,
  strictStyleIsolation: boolean,
  scopedCSS: boolean,
  appInstanceId: string,
): HTMLElement {
  // 创建一个 div 元素
  const containerElement = document.createElement('div');

  // appContent 是字符串，需要将其转换成 DOM 节点
  // innerHTML 可以解析包含在字符串中的 HTML 标签，并将其转换成 DOM 节点

  // 需要注意 innerHTML 解析的特性：
  // 1. 不会执行 script 标签中的脚本，例如 <script>alert('hello')</script>，不会执行 alert('hello')
  // 2. 不会转义字符串

  // textContent 会转义字符串，因此更加安全（当然两者功能不一样）

  // 将 appContent 转换成 DOM 节点
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div
  // appContent: 微应用的字符串内容
  // <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg="false">
  //   <!DOCTYPE html>
  //   <html lang="">
  //     <qiankun-head>
  //       <meta charset="utf-8" />
  //       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  //       <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  //       <link rel="icon" href="localhost:8080/favicon.ico" />
  //       <title>vue-micro-app</title>
  //       <style>
  //         body {
  //           margin: 0;
  //         }

  //         html > body {
  //           margin: 0;
  //         }

  //         body,
  //         html {
  //           margin: 0;
  //         }

  //         div,
  //         span,
  //         a {
  //           margin: 0;
  //         }
  //       </style>
  //       <!--   script http:localhost:8080/js/chunk-vendors.js replaced by import-html-entry -->
  //       <!--   script http:localhost:8080/js/app.js replaced by import-html-entry -->
  //       <style>
  //         /* http:localhost:8080/css/app.css **!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  //        !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css ***!
  //        \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

  //         h3[data-v-469af010] {
  //           margin: 40px 0 0;
  //         }
  //         ul[data-v-469af010] {
  //           padding: 0;
  //           list-style-type: none;
  //         }
  //         li[data-v-469af010] {
  //           display: inline-block;
  //           margin: 0 10px;
  //         }
  //         a[data-v-469af010] {
  //           color: #42b983;
  //         }

  //         /*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  //        !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css ***!
  //        \************************************************************************************************************************************************************************************************************************************************************************************************************************************/

  //         #app {
  //           margin-top: 60px;
  //           color: #2c3e50;
  //           font-family: Avenir, Helvetica, Arial, sans-serif;
  //           text-align: center;
  //           -webkit-font-smoothing: antialiased;
  //           -moz-osx-font-smoothing: grayscale;
  //         }
  //       </style></qiankun-head
  //     >
  //     <body>
  //       <noscript>
  //         <strong
  //           >We're sorry but vue-micro-app doesn't work properly without JavaScript enabled. Please enable it to
  //           continue.</strong
  //         >
  //       </noscript>
  //       <div id="app"></div>
  //     </body>
  //   </html>
  // </div>

  // 这里的 containerElement.firstChild 即为 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
  const appElement = containerElement.firstChild as HTMLElement;
  // 启用 Shadow DOM 隔离
  if (strictStyleIsolation) {
    // 如果浏览器不支持 Shadow DOM，则打印警告信息
    if (!supportShadowDOM) {
      console.warn(
        '[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!',
      );
    } else {
      // 缓存 appElement 的所有子元素
      const { innerHTML } = appElement;
      // 清空 appElement 的所有子元素
      appElement.innerHTML = '';
      let shadow: ShadowRoot;

      if (appElement.attachShadow) {
        // 在 appElement 上创建一个 Shadow DOM
        shadow = appElement.attachShadow({ mode: 'open' });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = (appElement as any).createShadowRoot();
      }
      // 将 appElement 的所有子元素添加到 Shadow DOM 中
      shadow.innerHTML = innerHTML;
    }
  }

  // 启用 Scoped 样式隔离
  if (scopedCSS) {
    const attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
    if (!attr) {
      appElement.setAttribute(css.QiankunCSSRewriteAttr, appInstanceId);
    }
    // 获取所有的内联样式节点
    const styleNodes = appElement.querySelectorAll('style') || [];
    // 遍历内联样式节点
    forEach(styleNodes, (stylesheetElement: HTMLStyleElement) => {
      // 处理内联样式节点，将所有的样式进行 Scoped 处理
      css.process(appElement!, stylesheetElement, appInstanceId);
    });
  }

  // 返回转换成 DOM 后的 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
  return appElement;
}

/** generate app wrapper dom getter */
function getAppWrapperGetter(
  appInstanceId: string,
  useLegacyRender: boolean,
  strictStyleIsolation: boolean,
  scopedCSS: boolean,
  elementGetter: () => HTMLElement | null,
) {
  return () => {
    // 外部注册时是否传入了自定义的 render 函数
    // 默认情况下为 undefined
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new QiankunError('strictStyleIsolation can not be used with legacy render!');
      if (scopedCSS) throw new QiankunError('experimentalStyleIsolation can not be used with legacy render!');

      const appWrapper = document.getElementById(getWrapperId(appInstanceId));
      assertElementExist(appWrapper, `Wrapper element for ${appInstanceId} is not existed!`);
      return appWrapper!;
    }

    // 获取微应用的 DOM 元素，例如 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
    const element = elementGetter();
    // 如果 element 不存在，则抛出异常
    assertElementExist(element, `Wrapper element for ${appInstanceId} is not existed!`);

    // 如果启用了 Shadow DOM 隔离，则返回 Shadow DOM
    if (strictStyleIsolation && supportShadowDOM) {
      return element!.shadowRoot!;
    }

    // 否则返回 DOM 元素
    return element!;
  };
}

const rawAppendChild = HTMLElement.prototype.appendChild;
const rawRemoveChild = HTMLElement.prototype.removeChild;
type ElementRender = (
  props: { element: HTMLElement | null; loading: boolean; container?: string | HTMLElement },
  phase: 'loading' | 'mounting' | 'mounted' | 'unmounted',
) => any;

/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appInstanceId
 * @param appContent
 * @param legacyRender
 */
function getRender(appInstanceId: string, appContent: string, legacyRender?: HTMLContentRender) {
  // element: 微应用的 DOM 元素，例如 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
  // loading: 是否加载中
  // container: 容器元素，用于渲染微应用
  const render: ElementRender = ({ element, loading, container }, phase) => {
    // 外部注册时是否传入了自定义的 render 函数
    // 默认情况下为 undefined
    if (legacyRender) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          '[qiankun] Custom rendering function is deprecated and will be removed in 3.0, you can use the container element setting instead!',
        );
      }

      return legacyRender({ loading, appContent: element ? appContent : '' });
    }

    // 获取容器元素
    // 例如本课程示例中，container 为 #micro-app-container
    // 查看 packages/main-app/utils/micros.ts 中 mockMicroApps 的 container 配置
    // 查看 packages/main-app/src/index.tsx 中 createBrowserRouter 的路由配置，其中包含了 id 为 micro-app-container 的容器元素
    const containerElement = getContainer(container!);

    // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed
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
      // 如果 container 对应的 DOM 元素不存在，则抛出异常
      assertElementExist(containerElement, errorMsg);
    }

    // container 容器元素存在，并且微应用的 DOM 元素不在 container 中
    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      // 清除 container 中的所有子元素
      while (containerElement!.firstChild) {
        rawRemoveChild.call(containerElement, containerElement!.firstChild);
      }

      // append the element to container if it exist
      // 如果微应用的 DOM 元素存在，则将其添加到 container 中
      // 注意这里所指的微应用 DOM 元素是包裹了 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false> 的元素
      if (element) {
        // 注意这里会将 element 添加到 container 元素中，这里是真正的渲染操作
        // 例如：
        // <div id="micro-app-container">
        //   <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg="false">
        //     <qiankun-head>
        //       <meta charset="utf-8" />
        //       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        //       <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        //       <link rel="icon" href="localhost:8080/favicon.ico" />
        //       <title>vue-micro-app</title>
        //       <style>
        //         body {
        //           margin: 0;
        //         }

        //         html > body {
        //           margin: 0;
        //         }

        //         body,
        //         html {
        //           margin: 0;
        //         }

        //         div,
        //         span,
        //         a {
        //           margin: 0;
        //         }
        //       </style>
        //       <!--   script http:localhost:8080/js/chunk-vendors.js replaced by import-html-entry -->
        //       <!--   script http:localhost:8080/js/app.js replaced by import-html-entry -->
        //       <style>
        //         /* http:localhost:8080/css/app.css */ /*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
        //          !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css ***!
        //          \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

        //         h3[data-v-469af010] {
        //           margin: 40px 0 0;
        //         }
        //         ul[data-v-469af010] {
        //           padding: 0;
        //           list-style-type: none;
        //         }
        //         li[data-v-469af010] {
        //           display: inline-block;
        //           margin: 0 10px;
        //         }
        //         a[data-v-469af010] {
        //           color: #42b983;
        //         }

        //         /*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
        //          !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css ***!
        //          \************************************************************************************************************************************************************************************************************************************************************************************************************************************/

        //         #app {
        //           margin-top: 60px;
        //           color: #2c3e50;
        //           font-family: Avenir, Helvetica, Arial, sans-serif;
        //           text-align: center;
        //           -webkit-font-smoothing: antialiased;
        //           -moz-osx-font-smoothing: grayscale;
        //         }
        //       </style>
        //     </qiankun-head>

        //     <noscript>
        //       <strong
        //         >We're sorry but vue-micro-app doesn't work properly without JavaScript enabled. Please enable it to
        //         continue.</strong
        //       >
        //     </noscript>
        //     <div id="app"></div>
        //   </div>
        // </div>

        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

function getLifecyclesFromExports(
  scriptExports: LifeCycles<any>,
  appName: string,
  global: WindowProxy,
  globalLatestSetProp?: PropertyKey | null,
) {
  // 判断 scriptExports 是否符合生命周期函数的格式
  // 如果符合，则直接返回
  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }

  // fallback to sandbox latest set property if it had
  // 如果 scriptExports 不符合生命周期函数的格式，则尝试从最后一个设置的 window 属性中获取
  // 无沙箱模式下，globalLatestSetProp 为 undefined
  if (globalLatestSetProp) {
    const lifecycles = (<any>global)[globalLatestSetProp];
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
  // 如果 scriptExports 不符合生命周期函数的格式，则尝试从 window[appName] 中获取
  const globalVariableExports = (global as any)[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new QiankunError(`You need to export lifecycle functions in ${appName} entry`);
}

let prevAppUnmountedDeferred: Deferred<void>;

export type ParcelConfigObjectGetter = (remountContainer?: string | HTMLElement) => ParcelConfigObject;

export async function loadApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration: FrameworkConfiguration = {},
  lifeCycles?: FrameworkLifeCycles<T>,
): Promise<ParcelConfigObjectGetter> {
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

  // 入参说明：
  // template: import-html-entry 返回的模板，会将外联的 CSS 样式内联到 template 中，将外联的 JS 脚本替换成注释添加到 template 中
  // 例如 Vue 微应用的 template 如下所示：
  // <!DOCTYPE html>
  // <html lang="">
  //   <head>
  //     <meta charset="utf-8" />
  //     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  //     <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  //     <link rel="icon" href="localhost:8080/favicon.ico" />
  //     <title>vue-micro-app</title>
  //     <style>
  //       body {
  //         margin: 0;
  //       }

  //       html > body {
  //         margin: 0;
  //       }

  //       body,
  //       html {
  //         margin: 0;
  //       }

  //       div,
  //       span,
  //       a {
  //         margin: 0;
  //       }
  //     </style>
  //     <!--   script http:localhost:8080/js/chunk-vendors.js replaced by import-html-entry -->
  //     <!--   script http:localhost:8080/js/app.js replaced by import-html-entry -->
  //     <style>
  //       /* http:localhost:8080/css/app.css **!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  //    !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css ***!
  //    \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

  //       h3[data-v-469af010] {
  //         margin: 40px 0 0;
  //       }
  //       ul[data-v-469af010] {
  //         padding: 0;
  //         list-style-type: none;
  //       }
  //       li[data-v-469af010] {
  //         display: inline-block;
  //         margin: 0 10px;
  //       }
  //       a[data-v-469af010] {
  //         color: #42b983;
  //       }

  //       /*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  //    !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css ***!
  //    \************************************************************************************************************************************************************************************************************************************************************************************************************************************/

  //       #app {
  //         margin-top: 60px;
  //         color: #2c3e50;
  //         font-family: Avenir, Helvetica, Arial, sans-serif;
  //         text-align: center;
  //         -webkit-font-smoothing: antialiased;
  //         -moz-osx-font-smoothing: grayscale;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <noscript>
  //       <strong
  //         >We're sorry but vue-micro-app doesn't work properly without JavaScript enabled. Please enable it to
  //         continue.</strong
  //       >
  //     </noscript>
  //     <div id="app"></div>
  //   </body>
  // </html>

  // appInstanceId: 例如 vue
  // sandbox: 沙箱配置，在 start 启动时传入了 false

  // getDefaultTplWrapper 作用：
  // 1. 将 <head> 标签替换成 <qiankun-head> 标签
  // 2. 在 template 的基础上包裹一个 div 元素，用于标记微应用的信息、框架版本号、是否启用沙箱隔离等
  //    例如：<div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
  //    无沙箱模式下 sandbox = false，因此 data-sandbox-cfg=false

  // appContent: 微应用的字符串内容
  // <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg="false">
  //   <!DOCTYPE html>
  //   <html lang="">
  //     <qiankun-head>
  //       <meta charset="utf-8" />
  //       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  //       <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  //       <link rel="icon" href="localhost:8080/favicon.ico" />
  //       <title>vue-micro-app</title>
  //       <style>
  //         body {
  //           margin: 0;
  //         }

  //         html > body {
  //           margin: 0;
  //         }

  //         body,
  //         html {
  //           margin: 0;
  //         }

  //         div,
  //         span,
  //         a {
  //           margin: 0;
  //         }
  //       </style>
  //       <!--   script http:localhost:8080/js/chunk-vendors.js replaced by import-html-entry -->
  //       <!--   script http:localhost:8080/js/app.js replaced by import-html-entry -->
  //       <style>
  //         /* http:localhost:8080/css/app.css **!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  //        !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css ***!
  //        \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

  //         h3[data-v-469af010] {
  //           margin: 40px 0 0;
  //         }
  //         ul[data-v-469af010] {
  //           padding: 0;
  //           list-style-type: none;
  //         }
  //         li[data-v-469af010] {
  //           display: inline-block;
  //           margin: 0 10px;
  //         }
  //         a[data-v-469af010] {
  //           color: #42b983;
  //         }

  //         /*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  //        !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css ***!
  //        \************************************************************************************************************************************************************************************************************************************************************************************************************************************/

  //         #app {
  //           margin-top: 60px;
  //           color: #2c3e50;
  //           font-family: Avenir, Helvetica, Arial, sans-serif;
  //           text-align: center;
  //           -webkit-font-smoothing: antialiased;
  //           -moz-osx-font-smoothing: grayscale;
  //         }
  //       </style></qiankun-head
  //     >
  //     <body>
  //       <noscript>
  //         <strong
  //           >We're sorry but vue-micro-app doesn't work properly without JavaScript enabled. Please enable it to
  //           continue.</strong
  //         >
  //       </noscript>
  //       <div id="app"></div>
  //     </body>
  //   </html>
  // </div>

  const appContent = getDefaultTplWrapper(appInstanceId, sandbox)(template);

  // 判断是否启用 Shadow DOM 隔离
  const strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;

  if (process.env.NODE_ENV === 'development' && strictStyleIsolation) {
    console.warn(
      "[qiankun] strictStyleIsolation configuration will be removed in 3.0, pls don't depend on it or use experimentalStyleIsolation instead!",
    );
  }

  // 判断是否启用 Scoped 样式隔离
  const scopedCSS = isEnableScopedCSS(sandbox);

  // 将 appContent 字符串转换成 DOM 节点
  // 返回转换成 DOM 后的 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
  let initialAppWrapperElement: HTMLElement | null = createElement(
    // 微应用的内容
    appContent,
    // 是否启用严格样式隔离
    strictStyleIsolation,
    // 是否启用 Scoped 样式隔离
    scopedCSS,
    // app 实例 id，例如 vue
    appInstanceId,
  );

  // 在 qiankun 的 registerMicroApps 中批量注册微应用时，会传入 container 参数
  const initialContainer = 'container' in app ? app.container : undefined;
  // 在 qiankun 的 registerMicroApps 中批量注册微应用时，可以传入 render 参数
  // 官方文档没有提到 render 参数
  const legacyRender = 'render' in app ? app.render : undefined;

  // 获取微应用的 render 渲染函数
  const render = getRender(appInstanceId, appContent, legacyRender);

  // 第一次加载设置应用可见区域 dom 结构
  // 确保每次应用加载前容器 dom 结构已经设置完毕

  // element: 微应用的 DOM 节点，即 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
  // loading: 是否加载中
  // container: 注册微应用时传入的 container 参数

  // 将创建的 element 元素挂载到 container 容器中
  // 这里是真实的 DOM 渲染操作，将微应用的 DOM 元素挂载到 container 中
  render({ element: initialAppWrapperElement, loading: true, container: initialContainer }, 'loading');

  const initialAppWrapperGetter = getAppWrapperGetter(
    // app 实例 id，例如 vue
    appInstanceId,
    // 是否是自定义的 render 函数，默认为 undefined
    !!legacyRender,
    // 是否启用严格样式隔离
    strictStyleIsolation,
    // 是否启用 Scoped 样式隔离
    scopedCSS,
    // elementGetter 用于获取微应用的 DOM 元素，即 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
    () => initialAppWrapperElement,
  );

  // 获取全局对象
  let global = globalContext;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  // 默认情况下，useLooseSandbox 为 true
  const useLooseSandbox = typeof sandbox === 'object' && !!sandbox.loose;
  // enable speedy mode by default
  // 默认情况下，speedySandbox 为 true
  const speedySandbox = typeof sandbox === 'object' ? sandbox.speedy !== false : true;
  let sandboxContainer;
  // 启用沙箱模式
  if (sandbox) {
    // 创建沙箱容器
    sandboxContainer = createSandboxContainer(
      // app 实例 id，例如 vue
      appInstanceId,
      // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
      initialAppWrapperGetter,
      // 是否启用了 Scoped 样式隔离
      scopedCSS,
      useLooseSandbox,
      excludeAssetFilter,
      // 传入全局对象
      global,
      speedySandbox,
    );
    // 用沙箱的代理对象作为接下来使用的全局对象
    global = sandboxContainer.instance.proxy as typeof window;
    mountSandbox = sandboxContainer.mount;
    unmountSandbox = sandboxContainer.unmount;
  }

  // assetPublicPath: 微应用的资源公共路径, 例如 http://localhost:8080/
  // lifeCycles: 微应用的生命周期钩子函数, 例如 { beforeLoad, beforeMount, afterMount, beforeUnmount, afterUnmount }
  const {
    beforeUnmount = [],
    afterUnmount = [],
    afterMount = [],
    beforeMount = [],
    beforeLoad = [],
    // 将所有的生命周期钩子函数都合并到相同属性的数组中
    // 例如 { beforeLoad: Function1 } 和 { beforeLoad: Function2 } 合并后为 { beforeLoad: [Function1, Function2] }
  } = mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, (v1, v2) => concat(v1 ?? [], v2 ?? []));

  // 批量执行 beforeLoad 异步钩子函数（每一个 beforeLoad 钩子的执行都需要在上一个钩子执行完成后再执行）
  await execHooksChain(toArray(beforeLoad), app, global);

  // get the lifecycle hooks from module exports
  // 执行微应用的 entry 脚本，获取微应用的导出对象
  const scriptExports: any = await execScripts(global, sandbox && !useLooseSandbox, {
    scopedGlobalVariables: speedySandbox ? cachedGlobals : [],
  });
  // 获取微应用的生命周期函数
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    scriptExports,
    // 微应用的名称，例如 vue
    appName,
    // 全局对象
    global,
    // 无沙箱模式下为 undefined
    sandboxContainer?.instance?.latestSetProp,
  );

  // 暂时忽略，后续讲解
  // 用于主应用和微应用之间通信
  const { onGlobalStateChange, setGlobalState, offGlobalStateChange }: Record<string, CallableFunction> =
    getMicroAppStateActions(appInstanceId);

  // FIXME temporary way
  // 用于重新设置初始的 appWrapperElement
  const syncAppWrapperElement2Sandbox = (element: HTMLElement | null) => (initialAppWrapperElement = element);

  const parcelConfigGetter: ParcelConfigObjectGetter = (remountContainer = initialContainer) => {
    let appWrapperElement: HTMLElement | null;
    let appWrapperGetter: ReturnType<typeof getAppWrapperGetter>;

    const parcelConfig: ParcelConfigObject = {
      name: appInstanceId,
      // 应用初始化时触发
      // single-spa 的 bootstrap 钩子函数
      bootstrap,
      // 应用挂载时触发
      // single-spa 的 mount 钩子函数
      mount: [
        async () => {
          // 如果是开发环境，则记录应用挂载的开始时间
          if (process.env.NODE_ENV === 'development') {
            const marks = performanceGetEntriesByName(markName, 'mark');
            // mark length is zero means the app is remounting
            if (marks && !marks.length) {
              performanceMark(markName);
            }
          }
        },
        async () => {
          // 如果是单实例模式，需要等待上一个应用卸载完成后再挂载当前应用
          // prevAppUnmountedDeferred 为上一个应用卸载完成后的延迟对象
          if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
            return prevAppUnmountedDeferred.promise;
          }

          return undefined;
        },
        // initial wrapper element before app mount/remount
        async () => {
          // 获取微应用的 element 元素, 例如 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
          appWrapperElement = initialAppWrapperElement;
          appWrapperGetter = getAppWrapperGetter(
            // app 实例 id，例如 vue
            appInstanceId,
            // 是否是自定义的 render 函数，默认为 undefined
            !!legacyRender,
            // 是否启用严格样式隔离
            strictStyleIsolation,
            // 是否启用 Scoped 样式隔离
            scopedCSS,
            // elementGetter 用于获取微应用的 DOM 元素，即 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
            () => appWrapperElement,
          );
        },
        // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
        async () => {
          // 重新挂载的容器和初始容器如果不一样，则表示使用了新的容器
          const useNewContainer = remountContainer !== initialContainer;
          // 如果使用了新的容器或者 appWrapperElement 不存在，则重新创建 appWrapperElement
          // 微应用卸载后会将 appWrapperElement 置为 null，防止内存泄漏
          // 再次 mount 时需要重新创建 appWrapperElement
          if (useNewContainer || !appWrapperElement) {
            // element will be destroyed after unmounted, we need to recreate it if it not exist
            // or we try to remount into a new container
            appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
            syncAppWrapperElement2Sandbox(appWrapperElement);
          }
          // 渲染微应用，注意这里是真正的 DOM 操作
          render({ element: appWrapperElement, loading: true, container: remountContainer }, 'mounting');
        },
        // 启动沙箱，暂时忽略
        mountSandbox,
        // exec the chain after rendering to keep the behavior with beforeLoad
        // 执行 beforeMount 钩子函数
        async () => execHooksChain(toArray(beforeMount), app, global),
        // 执行微应用导出的 mount 生命周期函数
        // 此时内部会调用 Vue 或者 React 框架的实例渲染微应用（注意在 render 中确保微应用的 HTML 模板已经渲染出来，这样框架才能基于已有的 root 元素进行应用挂载）

        // container: 容器元素，即微应用的 DOM 元素，例如 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
        async (props) => mount({ ...props, container: appWrapperGetter(), setGlobalState, onGlobalStateChange }),
        // finish loading after app mounted
        // 注意这里的 loading 主要为外部自定义的 render 函数使用，用于判断是否加载中
        // 例如在 render 中，可以根据 loading 的值来展示加载中的提示 UI
        // 但是在本课程中没有使用自定义的 render 函数，因此这里基本上不会用到 loading

        // 如果 element 元素存在并且在 container 中，render 不会进行任何操作
        // 这里只是用于告诉外部自定义的 render 函数 loading 的状态（默认情况下不存在外部自定义 render 函数）
        // 因此在本课程中，这里的 render 不会进行任何操作
        async () => render({ element: appWrapperElement, loading: false, container: remountContainer }, 'mounted'),
        // 执行 afterMount 钩子函数
        async () => execHooksChain(toArray(afterMount), app, global),
        // initialize the unmount defer after app mounted and resolve the defer after it unmounted
        async () => {
          // 如果是单例模式，设置 prevAppUnmountedDeferred 为新的 Deferred 对象
          // 如果当前挂载的微应用没有卸载完成，下一个需要加载的微应用会等待当前微应用卸载完成后再挂载
          if (await validateSingularMode(singular, app)) {
            prevAppUnmountedDeferred = new Deferred<void>();
          }
        },
        async () => {
          // 如果是开发环境，则记录应用加载的结束时间
          if (process.env.NODE_ENV === 'development') {
            const measureName = `[qiankun] App ${appInstanceId} Loading Consuming`;
            performanceMeasure(measureName, markName);
          }
        },
      ],
      // single-spa 的 unmount 钩子函数
      unmount: [
        // 执行 beforeUnmount 钩子函数
        async () => execHooksChain(toArray(beforeUnmount), app, global),
        // 执行微应用导出的 unmount 生命周期函数
        // 微应用内部会用 React 或者 Vue 框架卸载微应用实例
        async (props) => unmount({ ...props, container: appWrapperGetter() }),
        // 卸载沙箱，暂时忽略
        unmountSandbox,
        // 执行 afterUnmount 钩子函数
        async () => execHooksChain(toArray(afterUnmount), app, global),
        async () => {
          // 如果 element 不在 container 中，则会清除 container 中的所有子元素
          render({ element: null, loading: false, container: remountContainer }, 'unmounted');
          // 通信，暂时忽略
          offGlobalStateChange(appInstanceId);
          // for gc
          // 释放 appWrapperElement
          appWrapperElement = null;
          // 释放 initialAppWrapperElement
          syncAppWrapperElement2Sandbox(appWrapperElement);
        },
        async () => {
          // 如果是单例模式，卸载完成后将 prevAppUnmountedDeferred 的状态置为 fulfilled
          // 此时如果其他微应用需要挂载，可以进入挂载逻辑
          if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
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
