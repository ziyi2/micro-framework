import { LogPrefix, info } from '../../debugInfo';
import { SandBoxType } from '../../interfaces';
import { rebindTarget2Fn } from '../common';
// 判断属性是否可配置
function isPropConfigurable(target, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}
/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */
export default class LegacySandbox {
  /** 沙箱期间新增的全局变量 */
  addedPropsMapInSandbox = new Map();
  /** 沙箱期间更新的全局变量 */
  modifiedPropsOriginalValueMapInSandbox = new Map();
  /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
  currentUpdatedPropsValueMap = new Map();
  name;
  proxy;
  globalContext;
  type;
  sandboxRunning = true;
  latestSetProp = null;
  setWindowProp(prop, value, toDelete) {
    // 如果值为 undefined 且需要删除，则删除该属性
    if (value === undefined && toDelete) {
      // eslint-disable-next-line no-param-reassign
      delete this.globalContext[prop];
      // 如果属性可配置并且不是 symbol，则定义该属性
    } else if (isPropConfigurable(this.globalContext, prop) && typeof prop !== 'symbol') {
      Object.defineProperty(this.globalContext, prop, { writable: true, configurable: true });
      // 设置属性值
      // eslint-disable-next-line no-param-reassign
      this.globalContext[prop] = value;
    }
  }
  // 激活沙箱
  active() {
    if (!this.sandboxRunning) {
      // 将新增和修改的属性同步到 window 对象中
      this.currentUpdatedPropsValueMap.forEach((v, p) => this.setWindowProp(p, v));
    }
    this.sandboxRunning = true;
  }
  // 失活沙箱
  inactive() {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.addedPropsMapInSandbox.keys(),
        ...this.modifiedPropsOriginalValueMapInSandbox.keys(),
      ]);
    }
    // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
    // restore global props to initial snapshot
    // 恢复沙箱期间新增和修改的全局变量
    this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => this.setWindowProp(p, v));
    // 删除沙箱期间新增的全局变量
    // 注意必须将属性的描述符 configurable 设置为 true，否则无法删除
    // 这也是为什么在 getOwnPropertyDescriptor 方法中将 descriptor.configurable 设置为 true 的原因
    this.addedPropsMapInSandbox.forEach((_, p) => this.setWindowProp(p, undefined, true));
    this.sandboxRunning = false;
  }
  constructor(name, globalContext = window) {
    // 微应用名称
    this.name = name;
    // 全局对象
    this.globalContext = globalContext;
    // 沙箱类型
    this.type = SandBoxType.LegacyProxy;
    const { addedPropsMapInSandbox, modifiedPropsOriginalValueMapInSandbox, currentUpdatedPropsValueMap } = this;
    // 原始的 window 对象
    const rawWindow = globalContext;
    // 代理对象
    // 注意使用 Object.create(null) 创建一个干净的对象，避免原型链污染
    // 查找属性时不会查找到原型链上的属性，能够提升性能
    const fakeWindow = Object.create(null);
    const setTrap = (p, value, originalValue, sync2Window = true) => {
      if (this.sandboxRunning) {
        // 如果原始 window 对象不存在该属性，则记录到新增属性 map 中
        if (!rawWindow.hasOwnProperty(p)) {
          addedPropsMapInSandbox.set(p, value);
          info(
            LogPrefix.LEGACY_SANDBOX + `[set][${p}]`,
            `设置 addedPropsMapInSandbox: ${Array.from(addedPropsMapInSandbox.keys())}`,
          );
          // 如果不存在于更新属性 map 中，则记录到当前更新属性 map 中
        } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
          modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
          info(
            LogPrefix.LEGACY_SANDBOX + `[set][${p}]`,
            `设置 modifiedPropsOriginalValueMapInSandbox: ${Array.from(modifiedPropsOriginalValueMapInSandbox.keys())}`,
          );
        }
        // 记录到当前更新属性 map 中
        currentUpdatedPropsValueMap.set(p, value);
        info(
          LogPrefix.LEGACY_SANDBOX + `[set][${p}]`,
          `设置 currentUpdatedPropsValueMap: ${Array.from(currentUpdatedPropsValueMap.keys())}`,
        );
        // 同步到原始 window 对象中
        if (sync2Window) {
          info(LogPrefix.LEGACY_SANDBOX + `[set][${p}] 同步到原始 window 对象中: window["${p}"]=`, value);
          // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          rawWindow[p] = value;
        }
        // 记录最后一次更新的属性
        this.latestSetProp = p;
        return true;
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
      }
      // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
      return true;
    };
    const proxy = new Proxy(fakeWindow, {
      set: (_, p, value) => {
        const originalValue = rawWindow[p];
        return setTrap(p, value, originalValue, true);
      },
      get(_, p) {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13

        // 避免使用 window.window 或 window.self 来逃逸沙箱环境以触摸真正的 window
        // 从而难以被代理
        if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
          return proxy;
        }
        const value = rawWindow[p];
        info(LogPrefix.LEGACY_SANDBOX, `[get][${p}] 访问需要绑定到原生 window 对象的属性`);
        return rebindTarget2Fn(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(_, p) {
        info(LogPrefix.LEGACY_SANDBOX, `[has][拦截 in 和 with 操作符] has ${p}`);
        return p in rawWindow;
      },
      getOwnPropertyDescriptor(_, p) {
        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
        // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object

        // 这里为什么要将 descriptor.configurable 设置为 true？

        // 假设微应用 A 进行了如下设置：
        // Object.defineProperty(window, 'a', { configurable: false, value: 1 });

        // 如果没有沙箱的介入，微应用 B 能够访问到 window.a，但是微应用 B 压根不知道 window.a 是微应用 A 设置的，
        // 此时如果微应用 B 也设置了 window.a，那么微应用 A 的 window.a 就会被覆盖，这显然是不合理的。

        // 因此，沙箱的介入就是为了解决这个问题，沙箱会将 window.a 设置为可配置的
        // 并且在 inactive 阶段，会通过 delete window.a 的方式删除 window.a，从而保证微应用 A 的 window.a 不会被微应用 B 覆盖

        // 确保原本不可配置的属性在沙箱中变得可配置。
        // 这样做的目的是增加沙箱对属性的控制权，从而实现更灵活和安全的隔离
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      },
      defineProperty(_, p, attributes) {
        // 获取原始值
        const originalValue = rawWindow[p];
        // 定义属性
        const done = Reflect.defineProperty(rawWindow, p, attributes);
        // 获取新值
        const value = rawWindow[p];
        setTrap(p, value, originalValue, false);
        return done;
      },
    });
    this.proxy = proxy;
  }
  patchDocument() {}
}
