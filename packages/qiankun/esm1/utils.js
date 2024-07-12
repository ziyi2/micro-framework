/**
 * @author Kuitos
 * @since 2019-05-15
 */
import { isFunction, memoize, once, snakeCase } from 'lodash';
import { version } from './version';
export function toArray(array) {
  return Array.isArray(array) ? array : [array];
}
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Promise.then might be synchronized in Zone.js context, we need to use setTimeout instead to mock next tick.
// Since zone.js will hijack the setTimeout callback, and notify angular to do change detection, so we need to use the  __zone_symbol__setTimeout to avoid this, see https://github.com/umijs/qiankun/issues/2384

// 如果 window.__zone_symbol__setTimeout 存在，则使用 window.__zone_symbol__setTimeout，否则使用 Promise.resolve().then
const nextTick =
  typeof window.__zone_symbol__setTimeout === 'function'
    ? window.__zone_symbol__setTimeout
    : (cb) => Promise.resolve().then(cb);
let globalTaskPending = false;
/**
 * Run a callback before next task executing, and the invocation is idempotent in every singular task
 * That means even we called nextTask multi times in one task, only the first callback will be pushed to nextTick to be invoked.
 * @param cb
 */
export function nextTask(cb) {
  // 如果当前没有任务在执行，则将任务推入任务队列
  if (!globalTaskPending) {
    globalTaskPending = true;
    // 使用 nextTick 来模拟下一个任务 tick
    nextTick(() => {
      cb();
      // 任务执行完成后，将 globalTaskPending 置为 false
      globalTaskPending = false;
    });
  }
}
const fnRegexCheckCacheMap = new WeakMap();
export function isConstructable(fn) {
  // prototype methods might be changed while code running, so we need check it every time
  const hasPrototypeMethods =
    fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;
  if (hasPrototypeMethods) return true;
  if (fnRegexCheckCacheMap.has(fn)) {
    return fnRegexCheckCacheMap.get(fn);
  }
  /*
      1. 有 prototype 并且 prototype 上有定义一系列非 constructor 属性
      2. 函数名大写开头
      3. class 函数
      满足其一则可认定为构造函数
     */
  let constructable = hasPrototypeMethods;
  if (!constructable) {
    // fn.toString has a significant performance overhead, if hasPrototypeMethods check not passed, we will check the function string with regex
    const fnString = fn.toString();
    const constructableFunctionRegex = /^function\b\s[A-Z].*/;
    const classRegex = /^class\b/;
    constructable = constructableFunctionRegex.test(fnString) || classRegex.test(fnString);
  }
  fnRegexCheckCacheMap.set(fn, constructable);
  return constructable;
}
const callableFnCacheMap = new WeakMap();
export function isCallable(fn) {
  // 如果 fn 在 callableFnCacheMap 中，则直接返回
  if (callableFnCacheMap.has(fn)) {
    return true;
  }
  /**
   * We can not use typeof to confirm it is function as in some safari version
   * typeof document.all === 'undefined' // true
   * typeof document.all === 'function' // true
   */
  // 如果 fn 是函数，则将 fn 存入 callableFnCacheMap，并返回 true
  const callable = typeof fn === 'function' && fn instanceof Function;
  if (callable) {
    callableFnCacheMap.set(fn, callable);
  }
  return callable;
}
const frozenPropertyCacheMap = new WeakMap();
export function isPropertyFrozen(target, p) {
  if (!target || !p) {
    return false;
  }
  const targetPropertiesFromCache = frozenPropertyCacheMap.get(target) || {};
  // 如果 targetPropertiesFromCache[p] 存在，则直接返回
  if (targetPropertiesFromCache[p]) {
    return targetPropertiesFromCache[p];
  }
  // 如果 targetPropertiesFromCache[p] 不存在，则通过 Object.getOwnPropertyDescriptor 来获取属性描述符
  const propertyDescriptor = Object.getOwnPropertyDescriptor(target, p);
  // 如果属性描述符存在，并且 configurable 为 false，并且 writable 为 false 或者 get 存在且 set 不存在，则认为属性是冻结的
  const frozen = Boolean(
    propertyDescriptor &&
      propertyDescriptor.configurable === false &&
      (propertyDescriptor.writable === false || (propertyDescriptor.get && !propertyDescriptor.set)),
  );
  // 将结果存入 targetPropertiesFromCache
  targetPropertiesFromCache[p] = frozen;
  // 将 targetPropertiesFromCache 存入 frozenPropertyCacheMap
  frozenPropertyCacheMap.set(target, targetPropertiesFromCache);
  // 返回结果
  return frozen;
}
const boundedMap = new WeakMap();
export function isBoundedFunction(fn) {
  // 如果 fn 在 boundedMap 中，则直接返回
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  /*
     indexOf is faster than startsWith
     see https://jsperf.com/string-startswith/72
     */
  // 如果函数名以 bound 开头，并且没有 prototype 属性，则认为是 bounded function
  const bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
  boundedMap.set(fn, bounded);
  return bounded;
}

// 是否支持 const { a } = { a: 1 } 的解构赋值
export const isConstDestructAssignmentSupported = memoize(() => {
  try {
    new Function('const { a } = { a: 1 }')();
    return true;
  } catch (e) {
    return false;
  }
});
export const qiankunHeadTagName = 'qiankun-head';
// 获取默认的模板包装器, 用于包装子应用的模板
// qiankun 会在子应用的模板外层包裹一层 div，用于存储子应用的信息
export function getDefaultTplWrapper(name, sandboxOpts) {
  return (tpl) => {
    let tplWithSimulatedHead;
    // 如果模板中包含 <head> 标签，则将 <head> 标签替换为 <qiankun-head> 标签
    if (tpl.indexOf('<head>') !== -1) {
      // We need to mock a head placeholder as native head element will be erased by browser in micro app
      tplWithSimulatedHead = tpl
        .replace('<head>', `<${qiankunHeadTagName}>`)
        .replace('</head>', `</${qiankunHeadTagName}>`);
      // 如果模板中不包含 <head> 标签，则在模板的最前面添加一个 <qiankun-head> 标签
    } else {
      // Some template might not be a standard html document, thus we need to add a simulated head tag for them
      tplWithSimulatedHead = `<${qiankunHeadTagName}></${qiankunHeadTagName}>${tpl}`;
    }
    // 包装微应用的 template，添加 id、name、version、sandbox-cfg 属性
    // 用于存储微应用的信息、框架版本和沙箱配置
    // 例如以 vue 为例，这个 div 如下所示：
    // <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.6.12" data-sandbox-cfg=true>

    // 以 Vue 微应用为例，整体的返回结果如下：
    // <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=true>
    //   <!DOCTYPE html>
    //   <html lang="">
    //     <qiankun-head>
    //       <meta charset="utf-8">
    //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //       <meta name="viewport" content="width=device-width,initial-scale=1.0">
    //       <link rel="icon" href="//localhost:8080/favicon.ico">
    //       <title>vue-micro-app</title>
    //     <!--   script http://localhost:8080/js/chunk-vendors.js replaced by import-html-entry -->
    //     <!--   script http://localhost:8080/js/app.js replaced by import-html-entry -->
    //     <style>/* http://localhost:8080/css/app.css *//*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
    //     !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css ***!
    //     \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

    //   h3[data-v-469af010] {
    //     margin: 40px 0 0;
    //   }
    //   ul[data-v-469af010] {
    //     list-style-type: none;
    //     padding: 0;
    //   }
    //   li[data-v-469af010] {
    //     display: inline-block;
    //     margin: 0 10px;
    //   }
    //   a[data-v-469af010] {
    //     color: #42b983;
    //   }

    //   /*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
    //     !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css ***!
    //     \************************************************************************************************************************************************************************************************************************************************************************************************************************************/

    //   #app {
    //     font-family: Avenir, Helvetica, Arial, sans-serif;
    //     -webkit-font-smoothing: antialiased;
    //     -moz-osx-font-smoothing: grayscale;
    //     text-align: center;
    //     color: #2c3e50;
    //     margin-top: 60px;
    //   }

    //   </style></qiankun-head>
    //     <body>
    //       <noscript>
    //         <strong>We're sorry but vue-micro-app doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    //       </noscript>
    //       <div id="app"></div>

    //     </body>
    //   </html>
    // </div>

    return `<div id="${getWrapperId(
      name,
    )}" data-name="${name}" data-version="${version}" data-sandbox-cfg=${JSON.stringify(
      sandboxOpts,
    )}>${tplWithSimulatedHead}</div>`;
  };
}
export function getWrapperId(name) {
  return `__qiankun_microapp_wrapper_for_${snakeCase(name)}__`;
}
// new Function 的作用域是全局作用域，所以可以通过 new Function('return this')() 来获取全局对象
// 注意 eval 可以访问局部作用域，但是 (0, eval) 和 new Function 一样，访问的是全局作用域
// 更多关于 eval 和 Function 的细节可以查看之前的沙箱隔离课程：https://juejin.cn/book/7258893482318626868/section/7259192774364004392#heading-2
export const nativeGlobal = new Function('return this')();
export const nativeDocument = new Function('return document')();

// 用于存储全局的应用实例
// once: 保证只会在第一次调用时执行，后续执行会直接返回第一次调用的结果
// 通常用于初始化操作，例如数据库连接、只需要进行一次的事件监听、只需要进行一次的请求等
const getGlobalAppInstanceMap = once(() => {
  // 如果全局对象上没有 __app_instance_name_map__ 属性，则定义一个
  if (!nativeGlobal.hasOwnProperty('__app_instance_name_map__')) {
    // 定义 __app_instance_name_map__ 属性，用于存储全局的应用实例
    Object.defineProperty(nativeGlobal, '__app_instance_name_map__', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: {},
    });
  }
  // 返回全局的应用实例
  return nativeGlobal.__app_instance_name_map__;
});
/**
 * Get app instance name with the auto-increment approach
 * @param appName
 */
export const genAppInstanceIdByName = (appName) => {
  // 获取全局的 __app_instance_name_map__ 实例
  const globalAppInstanceMap = getGlobalAppInstanceMap();
  // 如果 appName 不在全局的 __app_instance_name_map__ 实例中，则初始化为 0
  if (!(appName in globalAppInstanceMap)) {
    nativeGlobal.__app_instance_name_map__[appName] = 0;
    return appName;
  }
  // 如果 appName 在全局的 __app_instance_name_map__ 实例中，则自增
  globalAppInstanceMap[appName]++;
  // 返回 appName_自增值
  return `${appName}_${globalAppInstanceMap[appName]}`;
};
/** 校验子应用导出的 生命周期 对象是否正确 */
export function validateExportLifecycle(exports) {
  const { bootstrap, mount, unmount } = exports ?? {};
  return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
}

// 创建一个 Promise 实例，用于等待异步操作的完成
export class Deferred {
  promise;
  resolve;
  reject;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
const supportsUserTiming =
  typeof performance !== 'undefined' &&
  typeof performance.mark === 'function' &&
  typeof performance.clearMarks === 'function' &&
  typeof performance.measure === 'function' &&
  typeof performance.clearMeasures === 'function' &&
  typeof performance.getEntriesByName === 'function';
export function performanceGetEntriesByName(markName, type) {
  let marks = null;
  if (supportsUserTiming) {
    marks = performance.getEntriesByName(markName, type);
  }
  return marks;
}
export function performanceMark(markName) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}
export function performanceMeasure(measureName, markName) {
  if (supportsUserTiming && performance.getEntriesByName(markName, 'mark').length) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}
// 是否启用 scoped css
export function isEnableScopedCSS(sandbox) {
  if (typeof sandbox !== 'object') {
    return false;
  }
  // 如果启用了严格的样式隔离，则不启用 scoped css
  if (sandbox.strictStyleIsolation) {
    return false;
  }
  // 如果外部传入了 experimentalStyleIsolation，则根据 experimentalStyleIsolation 的值来判断是否启用 scoped css
  return !!sandbox.experimentalStyleIsolation;
}
/**
 * copy from https://developer.mozilla.org/zh-CN/docs/Using_XPath
 * @param el
 * @param document
 */
export function getXPathForElement(el, document) {
  // not support that if el not existed in document yet(such as it not append to document before it mounted)
  if (!document.body.contains(el)) {
    return undefined;
  }
  let xpath = '';
  let pos;
  let tmpEle;
  let element = el;
  while (element !== document.documentElement) {
    pos = 0;
    tmpEle = element;
    while (tmpEle) {
      if (tmpEle.nodeType === 1 && tmpEle.nodeName === element.nodeName) {
        // If it is ELEMENT_NODE of the same name
        pos += 1;
      }
      tmpEle = tmpEle.previousSibling;
    }
    xpath = `*[name()='${element.nodeName}'][${pos}]/${xpath}`;
    element = element.parentNode;
  }
  xpath = `/*[name()='${document.documentElement.nodeName}']/${xpath}`;
  xpath = xpath.replace(/\/$/, '');
  return xpath;
}
// 获取容器元素
export function getContainer(container) {
  return typeof container === 'string' ? document.querySelector(container) : container;
}
export function getContainerXPath(container) {
  if (container) {
    const containerElement = getContainer(container);
    if (containerElement) {
      return getXPathForElement(containerElement, document);
    }
  }
  return undefined;
}
