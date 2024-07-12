/**
 * @author Kuitos
 * @since 2020-10-13
 */
import { LogPrefix, info } from '../../../debugInfo';
import { isBoundedFunction, isCallable, nativeDocument, nativeGlobal } from '../../../utils';
import { getCurrentRunningApp } from '../../common';
import {
  calcAppCount,
  getAppWrapperHeadElement,
  isAllAppsUnmounted,
  isHijackingTag,
  patchHTMLDynamicAppendPrototypeFunctions,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
  styleElementRefNodeNo,
  styleElementTargetSymbol,
} from './common';
const elementAttachedSymbol = Symbol('attachedApp');
// Get native global window with a sandbox disgusted way, thus we could share it between qiankun instances🤪
// 使用全局 window 对象（注意不是沙箱的 proxy 对象）定义 __proxyAttachContainerConfigMap__，这样可以在多个 qiankun 实例中共享
// 注意 nativeGlobal 通过 new Function('return this')() 获取（全局作用域），这样可以避免沙箱环境中的 window 对象
Object.defineProperty(nativeGlobal, '__proxyAttachContainerConfigMap__', { enumerable: false, writable: true });
Object.defineProperty(nativeGlobal, '__currentLockingSandbox__', {
  enumerable: false,
  writable: true,
  configurable: true,
});
const rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
const rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
// Share proxyAttachContainerConfigMap between multiple qiankun instance, thus they could access the same record
// 共享 proxyAttachContainerConfigMap，这样多个 qiankun 实例可以访问相同的记录
// 注意 WeakMap 和 Map 的区别：WeakMap 的 key 是弱引用，当 key 不存在时，value 也会被自动回收
nativeGlobal.__proxyAttachContainerConfigMap__ = nativeGlobal.__proxyAttachContainerConfigMap__ || new WeakMap();
const proxyAttachContainerConfigMap = nativeGlobal.__proxyAttachContainerConfigMap__;
// 用于记录元素与 proxy 配置的映射关系
const elementAttachContainerConfigMap = new WeakMap();
const docCreatePatchedMap = new WeakMap();
const patchMap = new WeakMap();
function patchDocument(cfg) {
  // 从 cfg 中获取 sandbox 和 speedy
  const { sandbox, speedy } = cfg;
  // 如果调用了微应用的 createElement 方法，则将微应用需要创建的元素缓存起来并与当前沙箱绑定
  const attachElementToProxy = (element, proxy) => {
    // 获取 proxy 对应的 containerConfig
    const proxyContainerConfig = proxyAttachContainerConfigMap.get(proxy);
    if (proxyContainerConfig) {
      info(
        `${LogPrefix.PROXY_SANDBOX} [attachElementToProxy] attach element to proxy`,
        Array.from(elementAttachContainerConfigMap),
      );
      // 设置 element 对应 proxyContainerConfig
      elementAttachContainerConfigMap.set(element, proxyContainerConfig);
    }
  };
  // 如果 speedy 为 true，则使用 Proxy 对 document 进行代理
  if (speedy) {
    // 设置修改对象
    const modifications = {};
    // 对 document 进行代理
    const proxyDocument = new Proxy(document, {
      /**
       * Read and write must be paired, otherwise the write operation will leak to the global
       */
      // 读写必须成对出现，否则写操作会泄漏到全局
      set: (target, p, value) => {
        switch (p) {
          // 拦截 createElement 方法
          case 'createElement': {
            info(LogPrefix.PROXY_SANDBOX, '[set][createElement] set createElement in document');
            // 将需要 createElement 的对象存储到 modifications 中
            modifications.createElement = value;
            break;
          }
          // 拦截 querySelector 方法
          case 'querySelector': {
            // 将需要 querySelector 的对象存储到 modifications 中
            info(LogPrefix.PROXY_SANDBOX, '[set][querySelector] set querySelector in document');
            modifications.querySelector = value;
            break;
          }
          default:
            info(LogPrefix.PROXY_SANDBOX, `[set][${p}] set ${p} in document`);
            target[p] = value;
            break;
        }
        return true;
      },
      get: (target, p, receiver) => {
        switch (p) {
          // 拦截 createElement 方法
          // 例如：document.createElement('div')
          case 'createElement': {
            info(LogPrefix.PROXY_SANDBOX, `[document][get][${p}] get ${p} in document`);
            // Must store the original createElement function to avoid error in nested sandbox
            // 必须存储原始的 createElement 函数，以避免嵌套沙箱中的错误
            const targetCreateElement = modifications.createElement || target.createElement;
            // 重写 createElement 方法
            return function createElement(...args) {
              // 如果当前没有锁定的沙箱，则将当前沙箱名称赋值给 __currentLockingSandbox__
              if (!nativeGlobal.__currentLockingSandbox__) {
                nativeGlobal.__currentLockingSandbox__ = sandbox.name;
              }
              const element = targetCreateElement.call(target, ...args);
              // only record the element which is created by the current sandbox, thus we can avoid the element created by nested sandboxes
              if (nativeGlobal.__currentLockingSandbox__ === sandbox.name) {
                // 记录当前微应用创建的元素，并将元素与当前沙箱绑定
                attachElementToProxy(element, sandbox.proxy);
                delete nativeGlobal.__currentLockingSandbox__;
              }
              return element;
            };
          }
          // 拦截 querySelector 方法
          case 'querySelector': {
            info(LogPrefix.PROXY_SANDBOX, `[document][get][${p}] get ${p} in document`);
            const targetQuerySelector = modifications.querySelector || target.querySelector;
            return function querySelector(...args) {
              const selector = args[0];
              switch (selector) {
                case 'head': {
                  const containerConfig = proxyAttachContainerConfigMap.get(sandbox.proxy);
                  if (containerConfig) {
                    const qiankunHead = getAppWrapperHeadElement(containerConfig.appWrapperGetter());
                    qiankunHead.appendChild = HTMLHeadElement.prototype.appendChild;
                    qiankunHead.insertBefore = HTMLHeadElement.prototype.insertBefore;
                    qiankunHead.removeChild = HTMLHeadElement.prototype.removeChild;
                    return qiankunHead;
                  }
                  break;
                }
              }
              return targetQuerySelector.call(target, ...args);
            };
          }
          default:
            break;
        }
        const value = target[p];
        info(LogPrefix.PROXY_SANDBOX, `[document][get][${p}] get ${p} in document`);
        // must rebind the function to the target otherwise it will cause illegal invocation error
        if (isCallable(value) && !isBoundedFunction(value)) {
          return function proxyFunction(...args) {
            return value.call(target, ...args.map((arg) => (arg === receiver ? target : arg)));
          };
        }
        return value;
      },
    });

    // 将代理对象 proxyDocument 与当前沙箱绑定
    sandbox.patchDocument(proxyDocument);
    // patch MutationObserver.prototype.observe to avoid type error
    // https://github.com/umijs/qiankun/issues/2406
    const nativeMutationObserverObserveFn = MutationObserver.prototype.observe;
    // 如果没有 patch 过，则进行 patch
    if (!patchMap.has(nativeMutationObserverObserveFn)) {
      const observe = function observe(target, options) {
        // 如果 target 是 Document 类型，则使用 nativeDocument，否则使用 target
        const realTarget = target instanceof Document ? nativeDocument : target;
        return nativeMutationObserverObserveFn.call(this, realTarget, options);
      };
      // 重写 observe 方法
      MutationObserver.prototype.observe = observe;
      patchMap.set(nativeMutationObserverObserveFn, observe);
    }
    // patch Node.prototype.compareDocumentPosition to avoid type error
    // 和 MutationObserver 类似，也是避免类型错误
    const prevCompareDocumentPosition = Node.prototype.compareDocumentPosition;
    if (!patchMap.has(prevCompareDocumentPosition)) {
      Node.prototype.compareDocumentPosition = function compareDocumentPosition(node) {
        const realNode = node instanceof Document ? nativeDocument : node;
        return prevCompareDocumentPosition.call(this, realNode);
      };
      patchMap.set(prevCompareDocumentPosition, Node.prototype.compareDocumentPosition);
    }
    // patch parentNode getter to avoid document === html.parentNode
    // https://github.com/umijs/qiankun/issues/2408#issuecomment-1446229105

    const parentNodeDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode');
    // 如果 parentNodeDescriptor 存在且没有 patch 过，则进行 patch
    if (parentNodeDescriptor && !patchMap.has(parentNodeDescriptor)) {
      const { get: parentNodeGetter, configurable } = parentNodeDescriptor;
      if (parentNodeGetter && configurable) {
        const patchedParentNodeDescriptor = {
          ...parentNodeDescriptor,
          get() {
            const parentNode = parentNodeGetter.call(this);
            if (parentNode instanceof Document) {
              const proxy = getCurrentRunningApp()?.window;
              if (proxy) {
                return proxy.document;
              }
            }
            return parentNode;
          },
        };
        Object.defineProperty(Node.prototype, 'parentNode', patchedParentNodeDescriptor);
        patchMap.set(parentNodeDescriptor, patchedParentNodeDescriptor);
      }
    }
    return () => {
      MutationObserver.prototype.observe = nativeMutationObserverObserveFn;
      patchMap.delete(nativeMutationObserverObserveFn);
      Node.prototype.compareDocumentPosition = prevCompareDocumentPosition;
      patchMap.delete(prevCompareDocumentPosition);
      if (parentNodeDescriptor) {
        Object.defineProperty(Node.prototype, 'parentNode', parentNodeDescriptor);
        patchMap.delete(parentNodeDescriptor);
      }
    };
  }
  // 如果设置了 speedy 为 false，则直接 patch document.createElement 方法
  const docCreateElementFnBeforeOverwrite = docCreatePatchedMap.get(document.createElement);
  // 如果 document.createElement 方法没有被 patch 过，则进行 patch
  if (!docCreateElementFnBeforeOverwrite) {
    // 缓存原始的 document.createElement 方法
    const rawDocumentCreateElement = document.createElement;
    // 重写 document.createElement 方法
    Document.prototype.createElement = function createElement(tagName, options) {
      // 创建元素
      const element = rawDocumentCreateElement.call(this, tagName, options);
      // 如果是 Link、Style、Script 标签，则将元素与当前沙箱绑定
      if (isHijackingTag(tagName)) {
        // 获取当前正在运行的应用
        const { window: currentRunningSandboxProxy } = getCurrentRunningApp() || {};
        // 如果当前正在运行的应用存在，则将元素与当前沙箱绑定
        if (currentRunningSandboxProxy) {
          // 将元素与当前沙箱绑定
          attachElementToProxy(element, currentRunningSandboxProxy);
        }
      }
      // 返回创建的元素
      return element;
    };
    // It means it have been overwritten while createElement is an own property of document
    // 如果 document 上有 createElement 方法，则重写 document.createElement 方法
    if (document.hasOwnProperty('createElement')) {
      // 重写 document.createElement 方法
      document.createElement = Document.prototype.createElement;
    }
    // 标记已经重写了 document.createElement 方法
    docCreatePatchedMap.set(Document.prototype.createElement, rawDocumentCreateElement);
  }
  // 返回 unpatch 方法，用于取消 patch
  return function unpatch() {
    if (docCreateElementFnBeforeOverwrite) {
      Document.prototype.createElement = docCreateElementFnBeforeOverwrite;
      document.createElement = docCreateElementFnBeforeOverwrite;
    }
  };
}
// ProxySandbox 处理
export function patchStrictSandbox(
  appName,
  appWrapperGetter,
  sandbox,
  mounting = true,
  scopedCSS = false,
  excludeAssetFilter,
  speedySandbox = false,
) {
  // 从沙箱中获取 window 代理对象
  const { proxy } = sandbox;
  // 获取沙箱对象 proxy 对应的 containerConfig
  let containerConfig = proxyAttachContainerConfigMap.get(proxy);
  // 如果 containerConfig 不存在，则创建一个新的 containerConfig
  if (!containerConfig) {
    containerConfig = {
      // 应用名称
      appName,
      // 沙箱代理对象
      proxy,
      // 用于获取微应用根节点
      appWrapperGetter,
      // 动态样式表元素
      dynamicStyleSheetElements: [],
      // 是否使用 scoped css
      strictGlobal: true,
      // 是否开启加速沙箱
      speedySandbox,
      // 排除资源过滤器
      excludeAssetFilter,
      // 是否使用 scoped css
      scopedCSS,
    };
    // 将 containerConfig 与 proxy 对象绑定
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  }
  // all dynamic style sheets are stored in proxy container
  // 所有动态样式表都存储在 proxy 对象对应的 containerConfig 中
  const { dynamicStyleSheetElements } = containerConfig;
  // 重写 document.head 和 document.body 的 appendChild、removeChild、insertBefore 方法
  // 如果识别到动态添加 CSS 样式和动态添加 script 标签，则进行 Scoped CSS 和 Script 沙箱处理
  const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
    (element) => {
      // 判断是否是微应用通过 createElement 需要创建的元素
      elementAttachContainerConfigMap.has(element);
    },
    (element) => {
      // 获取元素对应的 containerConfig
      elementAttachContainerConfigMap.get(element);
    },
  );
  // 重写 document 对象
  const unpatchDocument = patchDocument({ sandbox, speedy: speedySandbox });
  // 如果还没有挂载，则增加应用的 bootstrapping 计数
  if (!mounting) calcAppCount(appName, 'increase', 'bootstrapping');
  // 如果正在挂载，则增加应用的 mounting 计数
  if (mounting) calcAppCount(appName, 'increase', 'mounting');
  // 返回释放函数
  return function free() {
    // 如果没有挂载，则减少应用的 bootstrapping 计数
    if (!mounting) calcAppCount(appName, 'decrease', 'bootstrapping');
    // 如果正在挂载，则减少应用的 mounting 计数
    if (mounting) calcAppCount(appName, 'decrease', 'mounting');
    // release the overwritten prototype after all the micro apps unmounted
    // 释放所有微应用卸载后重写的原型
    if (isAllAppsUnmounted()) {
      // 释放动态添加 CSS 样式和动态添加 script 标签的重写，将 appendChild、removeChild、insertBefore 等方法恢复到原始状态
      unpatchDynamicAppendPrototypeFunctions();
      // 释放 document 对象的重写
      unpatchDocument();
    }
    recordStyledComponentsCSSRules(dynamicStyleSheetElements);
    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting
    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
        const appWrapper = appWrapperGetter();
        if (!appWrapper.contains(stylesheetElement)) {
          const mountDom =
            stylesheetElement[styleElementTargetSymbol] === 'head' ? getAppWrapperHeadElement(appWrapper) : appWrapper;
          const refNo = stylesheetElement[styleElementRefNodeNo];
          if (typeof refNo === 'number' && refNo !== -1) {
            // the reference node may be dynamic script comment which is not rebuilt while remounting thus reference node no longer exists
            const refNode = mountDom.childNodes[refNo] || null;
            rawHeadInsertBefore.call(mountDom, stylesheetElement, refNode);
            return true;
          } else {
            rawHeadAppendChild.call(mountDom, stylesheetElement);
            return true;
          }
        }
        return false;
      });
    };
  };
}
