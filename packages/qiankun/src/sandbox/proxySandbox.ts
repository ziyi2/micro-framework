/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2020-3-31
 */
import { without } from 'lodash';
import type { SandBox } from '../interfaces';
import { SandBoxType } from '../interfaces';
import { isPropertyFrozen, nativeGlobal, nextTask } from '../utils';
import { clearCurrentRunningApp, getCurrentRunningApp, rebindTarget2Fn, setCurrentRunningApp } from './common';
import { globalsInBrowser, globalsInES2015 } from './globals';
import { info, LogPrefix } from '../debugInfo';

type SymbolTarget = 'target' | 'globalContext';

type FakeWindow = Window & Record<PropertyKey, any>;

/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
function uniq(array: Array<string | symbol>) {
  return array.filter(function filter(this: PropertyKey[], element) {
    return element in this ? false : ((this as any)[element] = true);
  }, Object.create(null));
}

/**
 * transform array to object to enable faster element check with in operator
 * @param array
 */
function array2TruthyObject(array: string[]): Record<string, true> {
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

function isNativeGlobalProp(prop: string): boolean {
  return prop in cachedGlobalsInBrowser;
}

// zone.js will overwrite Object.defineProperty
const rawObjectDefineProperty = Object.defineProperty;

const variableWhiteListInDev =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || window.__QIANKUN_DEVELOPMENT__
    ? [
        // for react hot reload
        // see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
        '__REACT_ERROR_OVERLAY_GLOBAL_HOOK__',
        // for react development event issue, see https://github.com/umijs/qiankun/issues/2375
        'event',
      ]
    : [];
// who could escape the sandbox
const globalVariableWhiteList: string[] = [
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
const overwrittenGlobals = ['window', 'self', 'globalThis', 'hasOwnProperty'].concat(inTest ? [mockGlobalThis] : []);
export const cachedGlobals = Array.from(
  new Set(
    without(globalsInES2015.concat(overwrittenGlobals).concat('requestAnimationFrame'), ...accessingSpiedGlobals),
  ),
);

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

info(LogPrefix.PROXY_SANDBOX, `[unscopables](不会被 with 语句绑定的属性): ${JSON.stringify(unscopables, null, 2)}`);

const useNativeWindowForBindingsProps = new Map<PropertyKey, boolean>([
  ['fetch', true],
  ['mockDomAPIInBlackList', process.env.NODE_ENV === 'test'],
]);

function createFakeWindow(globalContext: Window, speedy: boolean) {
  // map always has the fastest performance in has checked scenario
  // see https://jsperf.com/array-indexof-vs-set-has/23
  // Map 具备非常快的 has 操作，比数组的 indexOf 方法快很多
  const propertiesWithGetter = new Map<PropertyKey, boolean>();
  // 创建一个空对象（注意在 Snapshot 模式下，fakeWindow 是 null）
  const fakeWindow = {} as FakeWindow;

  /*
   copy the non-configurable property of global to fakeWindow
   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
   > A property cannot be reported as non-configurable, if it does not exist as an own property of the target object or if it exists as a configurable own property of the target object.
   */
  // 拷贝 global 上的不可配置属性到 fakeWindow 上
  // getOwnPropertyNames 返回一个数组（1. 不包含原型链上的属性 2. 不包含 Symbol 属性）
  Object.getOwnPropertyNames(globalContext)
    .filter((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
      // 过滤出不可配置的属性
      // window 对象内置了很多不可配置的属性，例如 Infinity、NaN、undefined、window、document、location、top、chrome、__proxyAttachContainerConfigMap__
      // 这些属性默认不能被删除、不能被重新定义、不能被修改
      return !descriptor?.configurable;
    })
    .forEach((p) => {
      info(LogPrefix.PROXY_SANDBOX, `window 上不可配置属性: ${p}`);
      // 获取属性的描述符
      // 属性描述符主要包括两种：数据描述符和存取描述符
      // 数据描述符：value、writable、enumerable、configurable
      // 存取（访问器）描述符：get、set、enumerable、configurable
      const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
      if (descriptor) {
        // 判断是否是存取描述符
        const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');

        // 这段注释解释了为什么在使用 Proxy 的 get 捕获器时，
        // 需要将 top、self 和 window 属性设置为可配置和可写的，
        // 以避免在返回这些属性值时导致 TypeError

        // 详见：https://stackoverflow.com/questions/40921884/create-dynamic-non-configurable-properties-using-proxy
        // 详见：https://262.ecma-international.org/7.0/#sec-invariants-of-the-essential-internal-methods

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
          // window.document 在 speedy 模式下被重写
          (p === 'document' && speedy) ||
          (inTest && (p === mockTop || p === mockSafariTop))
        ) {
          // 设置属性描述符为可配置和可写
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
            descriptor.writable = true;
          }
        }

        // 如果是访问器描述符，则将属性缓存到 propertiesWithGetter 中
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
export default class ProxySandbox implements SandBox {
  /** window 值变更记录 */
  private updatedValueSet = new Set<PropertyKey>();
  private document = document;
  name: string;
  type: SandBoxType;
  proxy: WindowProxy;
  sandboxRunning = true;
  latestSetProp: PropertyKey | null = null;

  // 激活沙箱
  active() {
    // 如果沙箱还未运行，则激活沙箱，激活的 activeSandboxCount 加 1
    if (!this.sandboxRunning) activeSandboxCount++;
    this.sandboxRunning = true;
  }

  // 停止沙箱
  inactive() {
    if (process.env.NODE_ENV === 'development') {
      // 开发态打印沙箱的变更记录
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.updatedValueSet.keys(),
      ]);
    }

    // 如果 activeSandboxCount 为 0，则表明当前微应用已经卸载，需要重置全局变量
    if (inTest || --activeSandboxCount === 0) {
      console.info(`[qiankun:sandbox] globalWhitelistPrevDescriptor: `, this.globalWhitelistPrevDescriptor);

      // reset the global value to the prev value
      Object.keys(this.globalWhitelistPrevDescriptor).forEach((p) => {
        // 在 set 中如果设置的是全局变量白名单中的属性，则会记录白名单的原始描述符，这里需要将其还原
        const descriptor = this.globalWhitelistPrevDescriptor[p];
        if (descriptor) {
          // 还原属性描述符
          Object.defineProperty(this.globalContext, p, descriptor);
        } else {
          // 如果没有记录到属性描述符，则删除该属性
          // @ts-ignore
          delete this.globalContext[p];
        }
      });
    }

    this.sandboxRunning = false;
  }

  public patchDocument(doc: Document) {
    this.document = doc;
  }

  // the descriptor of global variables in whitelist before it been modified
  globalWhitelistPrevDescriptor: { [p in (typeof globalVariableWhiteList)[number]]: PropertyDescriptor | undefined } =
    {};
  globalContext: typeof window;

  constructor(name: string, globalContext = window, opts?: { speedy: boolean }) {
    this.name = name;
    this.globalContext = globalContext;
    // 记录沙箱类型
    this.type = SandBoxType.Proxy;
    const { updatedValueSet } = this;
    const { speedy } = opts || {};

    // 在 Snapshot 模式下，fakeWindow 是一个空对象，本质上只是一个代理对象，设置和获取的属性都是在 globalContext 上进行的
    // 在 Proxy 模式下，fakeWindow 是一个代理对象，设置和获取的属性都是在 fakeWindow 上进行的

    // 创建 fakeWindow 对象
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(globalContext, !!speedy);

    const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();

    // 创建代理对象
    const proxy = new Proxy(fakeWindow, {
      set: (target: FakeWindow, p: PropertyKey, value: any): boolean => {
        const sp = String(p);

        // 是否正在运行沙箱
        if (this.sandboxRunning) {
          // 1. name: 应用标识
          // 2. proxy: 代理对象
          //  注册当前运行的应用
          this.registerRunningApp(name, proxy);

          // sync the property to globalContext
          // 如果是全局变量白名单中的属性，则同步到 globalContext
          // 注意：这里的 globalContext 是 window，因此实现了沙箱的逃逸，设置的是 window 的属性
          if (typeof p === 'string' && globalVariableWhiteList.indexOf(p) !== -1) {
            info(
              LogPrefix.PROXY_SANDBOX +
                `[沙箱逃逸][set][${p}] ${p} 在 globalVariableWhiteList 逃逸的白名单中，设置 globalContext["${p}"] =`,
              value,
            );
            // 记录白名单属性的原始描述符
            this.globalWhitelistPrevDescriptor[p] = Object.getOwnPropertyDescriptor(globalContext, p);
            // 设置全局对象的属性值（注意不是代理对象）
            // @ts-ignore
            globalContext[p] = value;
          } else {
            // We must keep its description while the property existed in globalContext before
            // 如果属性不存在于代理对象中，但存在于 globalContext 中
            if (!target.hasOwnProperty(p) && globalContext.hasOwnProperty(p)) {
              // 获取该属性在 globalContext 中的属性描述符
              const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
              const { writable, configurable, enumerable, set } = descriptor!;
              // only writable property can be overwritten
              // here we ignored accessor descriptor of globalContext as it makes no sense to trigger its logic(which might make sandbox escaping instead)
              // we force to set value by data descriptor

              // 只有可写属性可以被重写
              // 这里忽略了 globalContext 的访问器描述符，因为触发它的逻辑没有意义（可能导致沙箱逃逸）
              // 我们强制通过数据描述符设置值

              // 如果属性是可写的或者可配置的，则设置属性值
              if (writable || set) {
                info(
                  LogPrefix.PROXY_SANDBOX +
                    `[沙箱捕获][set][${sp}] ${sp} 不存在隔离的 fakeWindow 对象中，但存在于 globalContext 中，并且 ${sp} 可读可 set，设置 fakeWindow["${sp}"] =`,
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
                  `[沙箱捕获][set][${sp}] ${sp} 存在于隔离的 fakeWindow 对象中或者 ${sp} 不存在于 globalContext 中，设置 fakeWindow["${sp}"] =`,
                value,
              );
              // 将值设置到 fakeWindow 上
              target[p] = value;
            }
          }

          // 记录变更的属性
          updatedValueSet.add(p);
          // 记录最后一次设置的属性
          this.latestSetProp = p;

          return true;
        }

        // 如果沙箱未运行，则不允许设置属性，并且打印警告信息
        // 这里可以感知到微应用在沙箱未运行时对 window 对象的修改
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
        }

        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true;
      },

      get: (target: FakeWindow, p: PropertyKey): any => {
        const sp = String(p);

        // 注册当前运行的应用
        this.registerRunningApp(name, proxy);

        // Symbol.unscopables

        // 从 unscopables 的英文单词 unscopable 中可以看出,
        // un scopabled 的意思就是不会被绑定作用域的意思
        // 在这里的意思是不会被 with 语句绑定作用域，例如以下一些例子

        // case1：foo 会先从 obj 中寻找
        // let obj = {
        // 如果是 true，会绕过 obj，直接从全局中寻找，这里是 false，会先从 obj 中寻找
        //   [Symbol.unscopables]: {
        //     foo: false,
        //   },

        //   foo: 111,
        // };

        // window.foo = 222;

        // with (obj) {
        //   console.log(foo); // 111
        // }

        // case2：如果 obj 中没有 foo 属性，会从全局中寻找
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

        // 1. 在 with(proxy) 中访问 proxy 的属性时，会先获取 proxy[Symbol.unscopables] 判断是否要跳过 with 作用域
        // 2. 访问 Symbol.unscopables 时会触发这里的 proxy 的 get 函数，因此这里会返回 unscopables
        // 3. unscopables 定义了 { "Array": true, "ArrayBuffer": true ... } 等
        // 4. Array 以及 ArrayBuffer 等都是不可重写的 API 对象，可以在多实例之间实现共享，不需要进行沙箱隔离
        // 5. 当 with(proxy) 内部访问 Array 时不会访问 proxy 代理对象的拦截处理，因为通过设置 unscopables 进行了作用域逃逸，因此访问的是全局 window 对象
        // 6. 如果没有设置拦截逃逸，那么会先访问 proxy.Array，又会触发 get 拦截器，假设访问不到，还要继续向上遍历访问全局的 globalWindow.Array
        // 7. 因此这里使用 unscopables 直接进行沙箱逃逸，直接访问全局的 window.Array 来提升性能
        if (p === Symbol.unscopables) return unscopables;
        // avoid who using window.window or window.self to escape the sandbox environment to touch the real window
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13

        // 避免使用 window.window 或 window.self 来逃逸沙箱环境，从而访问 window
        if (p === 'window' || p === 'self') {
          info(LogPrefix.PROXY_SANDBOX, `[沙箱捕获][get][${p}] 获取 proxy["${p}"]`);
          return proxy;
        }

        // hijack globalWindow accessing with globalThis keyword

        // 如果访问 globalThis，返回代理对象
        // globalThis 是一个全局对象，类似于 window，
        // 它是 ES2020 中引入的，确保在多个环境中都能访问到全局对象，不管是浏览器环境还是 Node.js 环境
        if (p === 'globalThis' || (inTest && p === mockGlobalThis)) {
          return proxy;
        }

        // 如果访问 window.top 或 window.parent
        if (p === 'top' || p === 'parent' || (inTest && (p === mockTop || p === mockSafariTop))) {
          // if your master app in an iframe context, allow these props escape the sandbox
          // 通过 window 是否等于 window.parent 来判断是否在 iframe 中
          // window === window.parent 为 true 时，表明当前窗口没有父窗口，因此不在 iframe 中
          // 如果主应用不在 iframe 中，则直接返回代理对象
          if (globalContext === globalContext.parent) {
            return proxy;
          }
          // 如果主应用在 iframe 中则访问主应用的 window.top 和 window.parent
          info(LogPrefix.PROXY_SANDBOX, `[沙箱逃逸][get][${p}] 主应用在 iframe 中，获取 globalContext["${p}"]`);
          return (globalContext as any)[p];
        }

        // proxy.hasOwnProperty would invoke getter firstly, then its value represented as globalContext.hasOwnProperty
        // proxy.hasOwnProperty 需要指向代理对象 target 上的 hasOwnProperty 方法或者全局对象上的 hasOwnProperty 方法
        if (p === 'hasOwnProperty') {
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
          return eval;
        }

        // 如果是全局变量白名单中的属性，则直接返回 globalContext 中的属性
        // 注意：这里的 globalContext 是 window，因此实现了沙箱的逃逸，返回的是 window 的属性
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
        console.log('propertiesWithGetter', propertiesWithGetter);
        const actualTarget = propertiesWithGetter.has(p) ? globalContext : p in target ? target : globalContext;
        const value = actualTarget[p];

        let isSandbox = true;
        if (propertiesWithGetter.has(p)) {
          isSandbox = false;
        } else if (p in target) {
          isSandbox = true;
        } else {
          isSandbox = false;
        }
        const sandboxPrefix = isSandbox ? '[沙箱捕获]' : '[沙箱逃逸]';
        const sandboxInfo = isSandbox ? `fakeWindow["${sp}"]` : `globalContext["${sp}"]`;

        // frozen value should return directly, see https://github.com/umijs/qiankun/issues/2015

        // 如果属性是不可写的，则直接返回属性值
        // 例如 Infinity
        if (isPropertyFrozen(actualTarget, p)) {
          info(LogPrefix.PROXY_SANDBOX, `${sandboxPrefix}[get][${sp}] 获取 ${sandboxInfo}`);
          return value;
        }

        // non-native property return directly to avoid rebind

        // 如果属性不是原生全局属性，则直接返回属性值
        // 原生全局属性包括 AbortController、AbortSignal、addEventListener、alert 等
        // 除此之外，还包含 fetch、mockDomAPIInBlackList 等属性
        if (!isNativeGlobalProp(p as string) && !useNativeWindowForBindingsProps.has(p)) {
          info(
            LogPrefix.PROXY_SANDBOX,
            // eslint-disable-next-line max-len
            `${sandboxPrefix}[get][${sp}] 访问非 cachedGlobalsInBrowser 和 useNativeWindowForBindingsProps 对应的 ${sandboxInfo}`,
          );
          return value;
        }

        /* Some dom api must be bound to native window, otherwise it would cause exception like 'TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation'
           See this code:
             const proxy = new Proxy(window, {});
             // in nest sandbox fetch will be bind to proxy rather than window in master
             const proxyFetch = fetch.bind(proxy);
             proxyFetch('https://qiankun.com');
        */

        // 如果是 fetch、mockDomAPIInBlackList 等属性，则需要绑定到原生 window 上
        info(
          LogPrefix.PROXY_SANDBOX,
          `[沙箱逃逸][get][${sp}] 访问需要绑定到原生 window 对象的属性，获取 ${sandboxInfo}`,
        );
        const boundTarget = useNativeWindowForBindingsProps.get(p) ? nativeGlobal : globalContext;
        return rebindTarget2Fn(boundTarget, value);
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      // 拦截 in 和 with 操作符，例如 'foo' in proxy、with (proxy) { foo } 时会触发
      has(target: FakeWindow, p: string | number | symbol): boolean {
        info(LogPrefix.PROXY_SANDBOX, `[has][拦截 in 和 with 操作符] has ${String(p)}`);
        // property in cachedGlobalObjects must return true to avoid escape from get trap
        return p in cachedGlobalObjects || p in target || p in globalContext;
      },
      // 拦截 Object.getOwnPropertyDescriptor，返回属性的描述符
      getOwnPropertyDescriptor(target: FakeWindow, p: string | number | symbol): PropertyDescriptor | undefined {
        const sp = String(p);

        /*
         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exist as an own property of the target object or if it exists as a configurable own property of the target object.
         */
        if (target.hasOwnProperty(p)) {
          info(LogPrefix.PROXY_SANDBOX, `[getOwnPropertyDescriptor] 通过 fakeWindow 获取 ${sp} 的属性描述符`);
          const descriptor = Object.getOwnPropertyDescriptor(target, p);
          // 设置属性描述符来源
          descriptorTargetMap.set(p, 'target');
          return descriptor;
        }

        if (globalContext.hasOwnProperty(p)) {
          info(LogPrefix.PROXY_SANDBOX, `[getOwnPropertyDescriptor] 通过 globalContext 获取 ${sp} 的属性描述符`);
          const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
          // 设置属性描述符来源
          descriptorTargetMap.set(p, 'globalContext');
          // A property cannot be reported as non-configurable, if it does not exist as an own property of the target object

          // 详见：https://stackoverflow.com/questions/40921884/create-dynamic-non-configurable-properties-using-proxy
          // 详见：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor#invariants
          // 详见：https://262.ecma-international.org/7.0/#sec-invariants-of-the-essential-internal-methods

          // 如果属性不存在，那么不能将其设置为不可配置
          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true;
          }
          return descriptor;
        }

        return undefined;
      },

      // trap to support iterator with sandbox
      // 拦截 for...in 循环、Object.keys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()、Reflect.ownKeys() 操作
      ownKeys(target: FakeWindow): ArrayLike<string | symbol> {
        // 返回一个数组，包含 target 和 globalContext 上的所有属性
        info(
          LogPrefix.PROXY_SANDBOX,
          // eslint-disable-next-line max-len
          `[ownKeys] 拦截 for...in 循环、Object.keys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()、Reflect.ownKeys()`,
        );
        return uniq(Reflect.ownKeys(globalContext).concat(Reflect.ownKeys(target)));
      },
      // 拦截 Object.defineProperty
      defineProperty: (target: Window, p: PropertyKey, attributes: PropertyDescriptor): boolean => {
        const sp = String(p);

        const from = descriptorTargetMap.get(p);
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */
        switch (from) {
          case 'globalContext':
            // 如果属性描述符来源于 globalContext, 则设置到 globalContext 上
            info(
              LogPrefix.PROXY_SANDBOX,
              `[defineProperty] 通过 globalContext 来定义 ${sp} 的描述符对象 ${attributes}`,
            );
            return Reflect.defineProperty(globalContext, p, attributes);
          default:
            // 如果属性描述符来源于 target, 则设置到 target 上
            info(LogPrefix.PROXY_SANDBOX, `[defineProperty] 通过 fakeWindow 来定义 ${sp} 的描述符对象 ${attributes}`);
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      // 拦截 delete 操作符，例如 delete proxy.foo 时会触发
      deleteProperty: (target: FakeWindow, p: string | number | symbol): boolean => {
        this.registerRunningApp(name, proxy);
        // 如果属性在代理对象上，则删除代理对象上的属性
        if (target.hasOwnProperty(p)) {
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
        return Reflect.getPrototypeOf(globalContext);
      },
    });

    // 设置 proxy 属性，用于传递给微应用
    this.proxy = proxy;

    // 激活的沙箱数量加一
    activeSandboxCount++;

    function hasOwnProperty(this: any, key: PropertyKey): boolean {
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

  private registerRunningApp(name: string, proxy: Window) {
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
