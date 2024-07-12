/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2020-3-31
 */
import { without } from 'lodash';
import { SandBoxType } from '../interfaces';
import { isPropertyFrozen, nativeGlobal, nextTask } from '../utils';
import { clearCurrentRunningApp, getCurrentRunningApp, rebindTarget2Fn, setCurrentRunningApp } from './common';
import { globalsInBrowser, globalsInES2015 } from './globals';
import { info, LogPrefix } from '../debugInfo';
/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
function uniq(array) {
  // 通过 filter 方法去重
  return array.filter(function filter(element) {
    return element in this ? false : (this[element] = true);
  }, Object.create(null));
}
/**
 * transform array to object to enable faster element check with in operator
 * @param array
 */
function array2TruthyObject(array) {
  return array.reduce(
    (acc, key) => {
      acc[key] = true;
      return acc;
    },
    // Notes that babel will transpile spread operator to Object.assign({}, ...args), which will keep the prototype of Object in merged object,
    // while this result used as Symbol.unscopables, it will make properties in Object.prototype always be escaped from proxy sandbox as unscopables check will look up prototype chain as well,
    // such as hasOwnProperty, toString, valueOf, etc.
    // so we should use Object.create(null) to create a pure object without prototype chain here.
    Object.create(null),
  );
}
const cachedGlobalsInBrowser = array2TruthyObject(
  globalsInBrowser.concat(process.env.NODE_ENV === 'test' ? ['mockNativeWindowFunction'] : []),
);

info(
  LogPrefix.PROXY_SANDBOX,
  `[cachedGlobalsInBrowser](沙箱逃逸的全局变量): ${JSON.stringify(cachedGlobalsInBrowser, null, 2)}`,
);

function isNativeGlobalProp(prop) {
  return prop in cachedGlobalsInBrowser;
}
// zone.js will overwrite Object.defineProperty
const rawObjectDefineProperty = Object.defineProperty;
const variableWhiteListInDev =
  // 如果是测试环境、开发环境或者 window.__QIANKUN_DEVELOPMENT__ 为 true 时
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || window.__QIANKUN_DEVELOPMENT__
    ? [
        // react hot reload 时需要的全局变量
        // for react hot reload
        // see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
        '__REACT_ERROR_OVERLAY_GLOBAL_HOOK__',
        // for react development event issue, see https://github.com/umijs/qiankun/issues/2375
        'event',
      ]
    : [];
info(
  LogPrefix.PROXY_SANDBOX,
  `[variableWhiteListInDev](开发环境下沙箱逃逸的全局变量): ${JSON.stringify(variableWhiteListInDev, null, 2)}`,
);

// who could escape the sandbox
// 哪些全局变量可以逃逸沙箱
const globalVariableWhiteList = [
  // FIXME System.js used a indirect call with eval, which would make it scope escape to global
  // To make System.js works well, we write it back to global window temporary
  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
  'System',
  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
  '__cjsWrapper',
  ...variableWhiteListInDev,
];
info(
  LogPrefix.PROXY_SANDBOX,
  `[globalVariableWhiteList](沙箱逃逸的全局变量): ${JSON.stringify(globalVariableWhiteList, null, 2)}`,
);
const inTest = process.env.NODE_ENV === 'test';
const mockSafariTop = 'mockSafariTop';
const mockTop = 'mockTop';
const mockGlobalThis = 'mockGlobalThis';
// these globals should be recorded while accessing every time
const accessingSpiedGlobals = ['document', 'top', 'parent', 'eval'];
info(
  LogPrefix.PROXY_SANDBOX,
  `[accessingSpiedGlobals](访问时记录的全局变量): ${JSON.stringify(accessingSpiedGlobals, null, 2)}`,
);
const overwrittenGlobals = ['window', 'self', 'globalThis', 'hasOwnProperty'].concat(inTest ? [mockGlobalThis] : []);
info(LogPrefix.PROXY_SANDBOX, `[overwrittenGlobals](被重写的全局变量): ${JSON.stringify(overwrittenGlobals, null, 2)}`);
// "Array"
// "ArrayBuffer"
// "Boolean"
// "constructor"
// "DataView"
// "Date"
// "decodeURI"
// "decodeURIComponent"
// "encodeURI"
// "encodeURIComponent"
// "Error"
// "escape"
// "EvalError"
// "Float32Array"
// "Float64Array"
// "Function"
// "hasOwnProperty"
// "Infinity"
// "Int16Array"
// "Int32Array"
// "Int8Array"
// "isFinite"
// "isNaN"
// "isPrototypeOf"
// "JSON"
// "Map"
// "Math"
// "NaN"
// "Number"
// "Object"
// "parseFloat"
// "parseInt"
// "Promise"
// "propertyIsEnumerable"
// "Proxy"
// "RangeError"
// "ReferenceError"
// "Reflect"
// "RegExp"
// "Set"
// "String"
// "Symbol"
// "SyntaxError"
// "toLocaleString"
// "toString"
// "TypeError"
// "Uint16Array"
// "Uint32Array"
// "Uint8Array"
// "Uint8ClampedArray"
// "undefined"
// "unescape"
// "URIError"
// "valueOf"
// "WeakMap"
// "WeakSet"
// "window"
// "self"
// "globalThis"
// "requestAnimationFrame"
export const cachedGlobals = Array.from(
  new Set(
    // _.without(array, [values])
    // 返回一个过滤值后的数组，过滤掉 array 中的 values
    // 去除了 document、top、parent、eval
    without(globalsInES2015.concat(overwrittenGlobals).concat('requestAnimationFrame'), ...accessingSpiedGlobals),
  ),
);
info(LogPrefix.PROXY_SANDBOX, `[cachedGlobals](缓存的全局变量): ${JSON.stringify(cachedGlobals, null, 2)}`);
const cachedGlobalObjects = array2TruthyObject(cachedGlobals);
/*
 Variables who are impossible to be overwritten need to be escaped from proxy sandbox for performance reasons.
 But overwritten globals must not be escaped, otherwise they will be leaked to the global scope.
 see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables
 */

// 1. 从 cachedGlobals 中过滤掉 overwrittenGlobals 和 accessingSpiedGlobals 中的属性
// 2. 因为被重写的全局变量不能被沙箱逃逸，所以这里需要过滤掉 overwrittenGlobals
// 3. 其余不能被重写的全局变量可以被沙箱逃逸，这样可以提高性能

// {
//   "Array": true,
//   "ArrayBuffer": true,
//   "Boolean": true,
//   "constructor": true,
//   "DataView": true,
//   "Date": true,
//   "decodeURI": true,
//   "decodeURIComponent": true,
//   "encodeURI": true,
//   "encodeURIComponent": true,
//   "Error": true,
//   "escape": true,
//   "EvalError": true,
//   "Float32Array": true,
//   "Float64Array": true,
//   "Function": true,
//   "Infinity": true,
//   "Int16Array": true,
//   "Int32Array": true,
//   "Int8Array": true,
//   "isFinite": true,
//   "isNaN": true,
//   "isPrototypeOf": true,
//   "JSON": true,
//   "Map": true,
//   "Math": true,
//   "NaN": true,
//   "Number": true,
//   "Object": true,
//   "parseFloat": true,
//   "parseInt": true,
//   "Promise": true,
//   "propertyIsEnumerable": true,
//   "Proxy": true,
//   "RangeError": true,
//   "ReferenceError": true,
//   "Reflect": true,
//   "RegExp": true,
//   "Set": true,
//   "String": true,
//   "Symbol": true,
//   "SyntaxError": true,
//   "toLocaleString": true,
//   "toString": true,
//   "TypeError": true,
//   "Uint16Array": true,
//   "Uint32Array": true,
//   "Uint8Array": true,
//   "Uint8ClampedArray": true,
//   "undefined": true,
//   "unescape": true,
//   "URIError": true,
//   "valueOf": true,
//   "WeakMap": true,
//   "WeakSet": true,
//   "requestAnimationFrame": true
// }
const unscopables = array2TruthyObject(without(cachedGlobals, ...accessingSpiedGlobals.concat(overwrittenGlobals)));
const useNativeWindowForBindingsProps = new Map([
  ['fetch', true],
  ['mockDomAPIInBlackList', process.env.NODE_ENV === 'test'],
]);
info(
  LogPrefix.PROXY_SANDBOX,
  `[useNativeWindowForBindingsProps](使用原生 window 对象的属性): ${JSON.stringify(
    Array.from(useNativeWindowForBindingsProps),
    null,
    2,
  )}`,
);
function createFakeWindow(globalContext, speedy) {
  // map always has the fastest performance in has checked scenario
  // see https://jsperf.com/array-indexof-vs-set-has/23
  // Map 具备非常快的 has 操作，比数组的 indexOf 方法快很多
  const propertiesWithGetter = new Map();
  // 创建一个假的 window 对象
  const fakeWindow = {};
  /*
     copy the non-configurable property of global to fakeWindow
     see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
     > A property cannot be reported as non-configurable, if it does not exist as an own property of the target object or if it exists as a configurable own property of the target object.
     */

  // 拷贝 global 上的属性到 fakeWindow 上
  // getOwnPropertyNames 返回一个数组（1. 不包含原型链上的属性 2. 不包含 Symbol 属性）
  Object.getOwnPropertyNames(globalContext)
    .filter((p) => {
      // 使用 Object.getOwnPropertyDescriptor 获取属性描述符
      const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
      // 过滤出不可配置的属性

      // window 对象内置了很多不可配置的属性
      // 如 window.top、window.self、window.window、window.parent
      // window.document、window.location、window.history 等

      // 这些属性不能被删除、不能被重新定义、不能被修改
      return !descriptor?.configurable;
    })
    .forEach((p) => {
      // 获取属性描述符
      const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
      // 如果属性描述符存在
      if (descriptor) {
        // 判断是否有 getter
        const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');
        /*
             make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
             see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
             > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
             */

        // 如果属性是 top/self/window/parent/document
        // 则将其设置为可配置和可写
        if (
          p === 'top' ||
          p === 'parent' ||
          p === 'self' ||
          p === 'window' ||
          // window.document is overwriting in speedy mode
          (p === 'document' && speedy) ||
          (inTest && (p === mockTop || p === mockSafariTop))
        ) {
          // 数据描述符：属性具有 value、writable、enumerable 和 configurable 特性
          // 访问器描述符：属性具有 get、set、enumerable 和 configurable 特性

          // 如果是数据描述符，设置 configurable 为 true，则可以通过 Object.defineProperty 重新定义属性
          // 如果是访问器描述符，设置 configurable 为 true，则可以通过 Object.defineProperty 重新定义 get 和 set 方法

          // 注意一个属性只能是数据描述符或访问器描述符中的一个
          descriptor.configurable = true;
          /*
                 The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
                 Example:
                  Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
                  Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
                 */

          // 注意在 Chrome/125.0.0.0 中 Object.getOwnPropertyDescriptor(window, 'top') 返回的是访问器描述符

          // 在 Safari 和 Firefox 中，window.window、window.top 和 window.self 是访问器描述符，
          // 它们的 get 函数返回 window 对象本身，set 函数是 undefined。
          // 在这种情况下，我们不能直接添加数据描述符 writable 特性，因为这会改变属性的性质，可能会导致错误。

          // 在旧版本的 Chrome 中，window.window、window.top 和 window.self 可能是数据描述符，
          // 它们的 value 是 window 对象本身，writable 是 false

          // 如果是数据描述符，设置 writable 为 true
          if (!hasGetter) {
            // 设置 writable 为 true，可以修改属性的值
            descriptor.writable = true;
          }
        }
        // 如果属性有 getter，则将其缓存到 propertiesWithGetter 中
        if (hasGetter) propertiesWithGetter.set(p, true);
        // freeze the descriptor to avoid being modified by zone.js
        // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71

        // 1. 将 window 上的不可配置的属性设置为可配置和可写后，将其设置到 fakeWindow 上
        // 2. 将属性描述符冻结，这些属性的描述符不可被 zone.js 修改
        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
      }
    });
  return {
    fakeWindow,
    propertiesWithGetter,
  };
}
let activeSandboxCount = 0;
/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox {
  /** window 值变更记录 */
  updatedValueSet = new Set();
  document = document;
  name;
  type;
  proxy;
  sandboxRunning = true;
  latestSetProp = null;
  // 激活沙箱
  active() {
    // 沙箱激活时，激活的沙箱数量加一
    if (!this.sandboxRunning) activeSandboxCount++;
    // 沙箱运行状态设置为 true
    this.sandboxRunning = true;
  }
  // 停用沙箱
  inactive() {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.updatedValueSet.keys(),
      ]);
    }
    if (inTest || --activeSandboxCount === 0) {
      // reset the global value to the prev value
      Object.keys(this.globalWhitelistPrevDescriptor).forEach((p) => {
        const descriptor = this.globalWhitelistPrevDescriptor[p];
        if (descriptor) {
          Object.defineProperty(this.globalContext, p, descriptor);
        } else {
          // @ts-ignore
          delete this.globalContext[p];
        }
      });
    }
    this.sandboxRunning = false;
  }
  // 存储 proxy document
  patchDocument(doc) {
    this.document = doc;
  }
  // the descriptor of global variables in whitelist before it been modified
  globalWhitelistPrevDescriptor = {};
  globalContext;
  constructor(name, globalContext = window, opts) {
    // 缓存应用标识
    this.name = name;
    // 缓存全局对象
    this.globalContext = globalContext;
    // 设置沙箱类型
    this.type = SandBoxType.Proxy;
    // 变更记录
    const { updatedValueSet } = this;
    // 是否启用 speedy 模式
    const { speedy } = opts || {};
    // 创建一个假的 window 对象，将不可配置的属性设置为可配置和可写
    // 此时 fakeWindow 包含了 window.top、window.window、window.location、window.document 等属性
    // propertiesWithGetter 包含了 window 上不可配置且有 getter 的属性，例如 window.location、window.document、window.top、window.window

    // 所以刚开始创建的 fakeWindow 只包含 chrome、document、location、top、window 等不可配置的属性
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(globalContext, !!speedy);
    const descriptorTargetMap = new Map();
    // 代理对象
    const proxy = new Proxy(fakeWindow, {
      // 拦截对象属性的读取操作，例如读取 proxy.foo 和 proxy['foo'] 时会触发

      // target: 代理对象
      // p: 属性名
      // value: 属性值
      set: (target, p, value) => {
        // 如果开启了沙箱
        if (this.sandboxRunning) {
          // 1. name: 应用标识
          // 2. proxy: 代理对象
          //  注册当前运行的应用
          this.registerRunningApp(name, proxy);
          // sync the property to globalContext
          // 1. 如果属性是字符串
          // 2. 如果属性在全局变量白名单中, 例如 "System"、"__REACT_ERROR_OVERLAY_GLOBAL_HOOK__"、"event"、"__cjsWrapper"
          // 允许沙箱逃逸
          if (typeof p === 'string' && globalVariableWhiteList.indexOf(p) !== -1) {
            info(
              LogPrefix.PROXY_SANDBOX +
                `[沙箱逃逸][set][${p}] ${p} 在 globalVariableWhiteList 逃逸的白名单中，globalContext["${p}"] =`,
              value,
            );
            // 缓存属性描述符
            this.globalWhitelistPrevDescriptor[p] = Object.getOwnPropertyDescriptor(globalContext, p);
            // @ts-ignore
            // 设置全局对象的属性值（注意不是代理对象）
            globalContext[p] = value;
          } else {
            // We must keep its description while the property existed in globalContext before
            // 如果属性不存在于代理对象中，但存在于 globalContext 中
            if (!target.hasOwnProperty(p) && globalContext.hasOwnProperty(p)) {
              // 获取该属性在 globalContext 中的属性描述符
              const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
              const { writable, configurable, enumerable, set } = descriptor;
              // only writable property can be overwritten
              // 只有可写属性可以被重写
              // here we ignored accessor descriptor of globalContext as it makes no sense to trigger its logic(which might make sandbox escaping instead)
              // 忽略 globalContext 的访问器描述符，因为触发它的逻辑没有意义（可能会导致沙箱逃逸）
              // we force to set value by data descriptor

              // 如果属性是可写的，或者 set 方法存在
              if (writable || set) {
                info(
                  LogPrefix.PROXY_SANDBOX +
                    // eslint-disable-next-line max-len
                    `[沙箱捕获][set][${p}] ${p} 不存在隔离的 fakeWindow 对象中，但存在于 globalContext 中，并且 ${p} 可读可 set，fakeWindow["${p}"] =`,
                  // eslint-disable-next-line max-len
                  value,
                );
                // 强制将值设置到 fakeWindow 上
                Object.defineProperty(target, p, { configurable, enumerable, writable: true, value });
              }

              // 如果 globalContext 上不存在该属性，则直接设置到 fakeWindow 上
            } else {
              info(
                LogPrefix.PROXY_SANDBOX +
                  // eslint-disable-next-line max-len
                  `[沙箱捕获][set][${p}] ${p} 存在于隔离的 fakeWindow 对象中或者 ${p} 不存在于 globalContext 中，fakeWindow["${p}"] =`,
                value,
              );
              // 设置属性值
              target[p] = value;
            }
          }
          // 记录变更的属性
          updatedValueSet.add(p);
          // 记录最后一次设置的属性
          this.latestSetProp = p;
          return true;
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
        }
        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true;
      },
      // 拦截对象属性的设置操作，例如 proxy.foo = 1 和 proxy['foo'] = 1 时会触发
      get: (target, p) => {
        // 注册当前运行的应用
        this.registerRunningApp(name, proxy);

        // Symbol.unscopables

        // 从 unscopables 的英文单词 unscopable 中可以看出,
        // un scopabled 的意思就是不会被绑定作用域的意思
        // 在这里的意思是不会被 with 语句绑定作用域，例如以下一些例子

        // case1：foo 会先从 obj 中寻找
        // let obj = {
        //   [Symbol.unscopables]: {
        //     foo: false,
        //   },

        //   foo: 111,
        // };

        // window.foo = 222;

        // with (obj) {
        //   console.log(foo); // 111
        // }

        // case2：如果 obj 中没有才会从全局中寻找
        // let obj = {
        //   [Symbol.unscopables]: {
        //     foo: false,
        //   },
        // };

        // window.foo = 222;

        // with (obj) {
        //   console.log(foo); // 222
        // }

        // case3：foo 不会从 obj 中寻找，而是绕过后从全局中寻找
        // let obj = {
        //   [Symbol.unscopables]: {
        //     foo: true,
        //   },

        //   foo: 111,
        // };

        // window.foo = 222;

        // with (obj) {
        //   console.log(foo); // 222
        // }

        // case4：foo 不会从 obj 中寻找，而是绕过后从全局中寻找
        // let obj = {
        //   [Symbol.unscopables]: {
        //     foo: true,
        //   },
        // };

        // window.foo = 222;

        // with (obj) {
        //   console.log(foo); // 222
        // }

        // 1. 如果外部使用 with(proxy) 访问时，会先获取 proxy[Symbol.unscopables] 判断是否要跳过 with 作用域
        // 2. 会触发这里的 proxy 的 get 函数，因此这里会返回 unscopables
        // 3. unscopables 定义了 { "Array": true, "ArrayBuffer": true ... } 等
        // 4. Array 以及 ArrayBuffer 等都是不可重写的 API 对象，可以在多实例之间实现共享，不需要进行沙箱隔离
        // 5. 当 with(proxy) 内部访问 Array 时不会访问 proxy 代理对象的拦截处理，因为通过设置 unscopables 进行了作用域逃逸，因此访问的是全局 window 对象
        // 6. 如果没有设置拦截逃逸，那么会先访问 proxy.Array，又会触发 get 拦截器，假设访问不到，还要继续向上遍历访问全局的 globalWindow.Array
        // 7. 因此这里使用 unscopables 直接进行沙箱逃逸，直接访问全局的 window.Array 来提升性能
        if (p === Symbol.unscopables) {
          info(LogPrefix.PROXY_SANDBOX, `[沙箱逃逸][get][Symbol.unscopables] get unscopables`);
          return unscopables;
        }
        // avoid who using window.window or window.self to escape the sandbox environment to touch the real window
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        // 避免使用 window.window 或 window.self 来逃逸沙箱环境，以触摸真实的 window
        if (p === 'window' || p === 'self') {
          info(LogPrefix.PROXY_SANDBOX, `[沙箱捕获][get][${p}] 获取 proxy["${p}"]`);
          return proxy;
        }
        // hijack globalWindow accessing with globalThis keyword
        // 如果访问 globalThis，返回代理对象
        // globalThis 是一个全局对象，类似于 window，
        // 它是 ES2020 中引入的，确保在多个环境中都能访问到全局对象，不管是浏览器环境还是 Node.js 环境
        if (p === 'globalThis' || (inTest && p === mockGlobalThis)) {
          info(LogPrefix.PROXY_SANDBOX, `[沙箱捕获][get][${p}] 获取 proxy["${p}"]`);
          return proxy;
        }
        // 如果访问 window.top 或 window.parent
        if (p === 'top' || p === 'parent' || (inTest && (p === mockTop || p === mockSafariTop))) {
          // if your master app in an iframe context, allow these props escape the sandbox
          // 通过 window 是否等于 window.parent 来判断是否在 iframe 中
          // window === window.parent 为 true 时，表明当前窗口没有父窗口，因此不在 iframe 中
          // 如果主应用不在 iframe 中，则直接返回代理对象
          if (globalContext === globalContext.parent) {
            info(LogPrefix.PROXY_SANDBOX, `[沙箱捕获][get][${p}] 此时主应用不在 iframe 中，获取 proxy["${p}"]`);
            return proxy;
          }
          // 如果主应用在 iframe 中则访问主应用的 window.top 和 window.parent
          info(LogPrefix.PROXY_SANDBOX, `[沙箱逃逸][get][${p}] 主应用在 iframe 中，获取 globalContext["${p}"]`);
          return globalContext[p];
        }
        // proxy.hasOwnProperty would invoke getter firstly, then its value represented as globalContext.hasOwnProperty
        // proxy.hasOwnProperty 需要指向代理对象 target 上的 hasOwnProperty 方法或者全局对象上的 hasOwnProperty 方法
        if (p === 'hasOwnProperty') {
          info(LogPrefix.PROXY_SANDBOX, `[沙箱捕获][get][${p}] 获取重写后的 hasOwnProperty`);
          return hasOwnProperty;
        }
        // 如果访问的属性是 document，则返回代理的 document 对象
        if (p === 'document') {
          info(LogPrefix.PROXY_SANDBOX, `[沙箱捕获][get][${p}] 获取 proxy document 对象`);
          return this.document;
        }
        // 如果访问的属性是 eval，则返回 eval 函数
        // 注意默认的 fakeWindow 上没有 eval 方法，因此这里返回的是全局的 eval 方法
        if (p === 'eval') {
          info(LogPrefix.PROXY_SANDBOX, `[沙箱逃逸][get][${p}] 获取 eval 函数`);
          return eval;
        }
        // 如果访问的属性命中了 globalVariableWhiteList 白名单，则可以进行沙箱逃逸
        // "System"、"__cjsWrapper"、"__REACT_ERROR_OVERLAY_GLOBAL_HOOK__" 和 "event" 可以进行沙箱逃逸
        if (p === 'string' && globalVariableWhiteList.indexOf(p) !== -1) {
          info(
            LogPrefix.PROXY_SANDBOX,
            `[沙箱逃逸][get][${p}] 使用 globalContext 对象访问 globalVariableWhiteList 沙箱逃逸白名单 ${p}, 获取 globalContext["${p}"]`,
          );
          // @ts-ignore
          return globalContext[p];
        }
        // 1. 如果是 window 的访问器属性，包括 window、document、location 和 top，则使用 globalContext
        // 2. 否则如果 p 在 target 上，则使用代理对象
        // 3. 否则使用全局对象
        const actualTarget = propertiesWithGetter.has(p) ? globalContext : p in target ? target : globalContext;

        const value = actualTarget[p];

        let isSandbox = true;
        if (propertiesWithGetter.has(p)) {
          isSandbox = false;
        } else if (p in target) {
        } else {
          isSandbox = false;
        }
        const sandboxPrefix = isSandbox ? '[沙箱捕获]' : '[沙箱逃逸]';
        const sandboxInfo = isSandbox ? `fakeWindow["${p}"]` : `globalContext["${p}"]`;

        // frozen value should return directly, see https://github.com/umijs/qiankun/issues/2015
        // 如果属性是不可写的，则直接返回属性值
        // 例如 Infinity
        if (isPropertyFrozen(actualTarget, p)) {
          info(LogPrefix.PROXY_SANDBOX, `${sandboxPrefix}[get][${p}] 获取 ${sandboxInfo}`);
          return value;
        }
        // non-native property return directly to avoid rebind
        // 如果属性不是原生全局属性，则直接返回属性值
        // 原生全局属性包括 AbortController、AbortSignal、addEventListener、alert 等
        // 除此之外，还包含 fetch、mockDomAPIInBlackList 等属性

        if (!isNativeGlobalProp(p) && !useNativeWindowForBindingsProps.has(p)) {
          info(
            LogPrefix.PROXY_SANDBOX,
            // eslint-disable-next-line max-len
            `${sandboxPrefix}[get][${p}] 访问非 cachedGlobalsInBrowser 和 useNativeWindowForBindingsProps 对应的 ${sandboxInfo}`,
          );
          // 例如通过 globalContext 获取的属性，包括 Array、Int16Array 等
          return value;
        }
        /* Some dom api must be bound to native window, otherwise it would cause exception like 'TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation'
                   See this code:
                     const proxy = new Proxy(window, {});
                     // in nest sandbox fetch will be bind to proxy rather than window in master
                     const proxyFetch = fetch.bind(proxy);
                     proxyFetch('https://qiankun.com');
                */
        // 如果属性是 fetch、mockDomAPIInBlackList 等属性，则需要绑定到原生 window 上
        info(
          LogPrefix.PROXY_SANDBOX,
          `[沙箱逃逸][get][${p}] 访问需要绑定到原生 window 对象的属性，获取 ${sandboxInfo}`,
        );
        const boundTarget = useNativeWindowForBindingsProps.get(p) ? nativeGlobal : globalContext;
        return rebindTarget2Fn(boundTarget, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      // 拦截 in 和 with 操作符，例如 'foo' in proxy、with (proxy) { foo } 时会触发
      has(target, p) {
        info(LogPrefix.PROXY_SANDBOX, `[has][拦截 in 和 with 操作符] has ${p}`);
        // property in cachedGlobalObjects must return true to avoid escape from get trap
        return p in cachedGlobalObjects || p in target || p in globalContext;
      },
      // 拦截 Object.getOwnPropertyDescriptor，返回属性的描述符
      getOwnPropertyDescriptor(target, p) {
        /*
                 as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
                 see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
                 > A property cannot be reported as non-configurable, if it does not exist as an own property of the target object or if it exists as a configurable own property of the target object.
                 */
        if (target.hasOwnProperty(p)) {
          info(LogPrefix.PROXY_SANDBOX, `[getOwnPropertyDescriptor] 通过 fakeWindow 获取 ${p} 的属性描述符`);
          const descriptor = Object.getOwnPropertyDescriptor(target, p);
          // 设置属性描述符来源
          descriptorTargetMap.set(p, 'target');
          return descriptor;
        }
        if (globalContext.hasOwnProperty(p)) {
          info(LogPrefix.PROXY_SANDBOX, `[getOwnPropertyDescriptor] 通过 globalContext 获取 ${p} 的属性描述符`);
          const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
          // 设置属性描述符来源
          descriptorTargetMap.set(p, 'globalContext');
          // A property cannot be reported as non-configurable, if it does not exist as an own property of the target object
          // 如果属性不作为目标对象自己的属性存在，则不能将其报告为不可配置
          if (descriptor && !descriptor.configurable) {
            // 如果属性描述符是不可配置的，则将其设置为可配置
            descriptor.configurable = true;
          }
          return descriptor;
        }
        return undefined;
      },
      // trap to support iterator with sandbox
      // 拦截 for...in 循环、Object.keys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()、Reflect.ownKeys() 操作
      ownKeys(target) {
        // 返回一个数组，包含 target 和 globalContext 上的所有属性
        info(
          LogPrefix.PROXY_SANDBOX,
          // eslint-disable-next-line max-len
          `[ownKeys] 拦截 for...in 循环、Object.keys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()、Reflect.ownKeys()`,
        );
        return uniq(Reflect.ownKeys(globalContext).concat(Reflect.ownKeys(target)));
      },
      // 拦截 Object.defineProperty
      defineProperty: (target, p, attributes) => {
        // 获取属性描述符来源
        const from = descriptorTargetMap.get(p);
        /*
                 Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
                 otherwise it would cause a TypeError with illegal invocation.
                 */
        switch (from) {
          // 如果属性描述符来源于 globalContext, 则设置到 globalContext 上
          case 'globalContext':
            info(LogPrefix.PROXY_SANDBOX, `[defineProperty] 通过 globalContext 来定义 ${p} 的描述符对象 ${attributes}`);
            return Reflect.defineProperty(globalContext, p, attributes);
          default:
            // 如果属性描述符来源于 target, 则设置到 target 上
            info(LogPrefix.PROXY_SANDBOX, `[defineProperty] 通过 fakeWindow 来定义 ${p} 的描述符对象 ${attributes}`);
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      // 拦截 delete 操作符，例如 delete proxy.foo 时会触发
      deleteProperty: (target, p) => {
        this.registerRunningApp(name, proxy);
        // 如果属性在代理对象上，则删除代理对象上的属性
        if (target.hasOwnProperty(p)) {
          info(LogPrefix.PROXY_SANDBOX, `[deleteProperty] 删除 fakeWindow 上的属性 ${p}`);
          // @ts-ignore
          delete target[p];
          // 记录变更的属性
          updatedValueSet.delete(p);
          return true;
        }
        return true;
      },
      // makes sure `window instanceof Window` returns truthy in micro app
      // 用于拦截对目标对象的原型（即 [[Prototype]]）的获取操作
      // 包括：proxy.__proto__、Object.prototype.isPrototypeOf(proxy)、Object.getPrototypeOf(proxy)、Reflect.getPrototypeOf(proxy)、instanceof
      getPrototypeOf() {
        info(LogPrefix.PROXY_SANDBOX, `[getPrototypeOf] 获取 globalContext 的原型对象`);
        return Reflect.getPrototypeOf(globalContext);
      },
    });
    // 缓存代理对象
    this.proxy = proxy;
    // 激活的沙箱数量加一
    activeSandboxCount++;
    function hasOwnProperty(key) {
      // calling from hasOwnProperty.call(obj, key)
      // 如果外部调用 hasOwnProperty.call(obj, key) 时，则会判断 this 是否是代理对象
      if (this !== proxy && this !== null && typeof this === 'object') {
        // 如果 this 不是代理对象，则调用原生的 hasOwnProperty 方法
        return Object.prototype.hasOwnProperty.call(this, key);
      }
      // 如果 this 是代理对象，则判断 key 是否在代理对象对应的 fakeWindow 上
      // 或者 key 是否在全局对象上
      return fakeWindow.hasOwnProperty(key) || globalContext.hasOwnProperty(key);
    }
  }
  registerRunningApp(name, proxy) {
    // 如果开启了沙箱
    if (this.sandboxRunning) {
      // 获取当前正在运行的应用
      const currentRunningApp = getCurrentRunningApp();
      // 如果当前正在运行的应用不存在，或者当前正在运行的应用的名称不等于当前应用的名称
      if (!currentRunningApp || currentRunningApp.name !== name) {
        // 设置当前正在运行的应用
        setCurrentRunningApp({ name, window: proxy });
      }
      // FIXME if you have any other good ideas
      // remove the mark in next tick, thus we can identify whether it in micro app or not
      // this approach is just a workaround, it could not cover all complex cases, such as the micro app runs in the same task context with master in some case

      // 在下一个 tick 中清除标记，这样我们就可以识别它是否在微应用中
      // 这种方法只是一个解决方法，不能覆盖所有复杂情况，例如在某些情况下，微应用在相同的任务上下文中与主应用运行
      nextTask(clearCurrentRunningApp);
    }
  }
}
