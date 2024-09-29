/**
 * @author Kuitos
 * @since 2019-04-11
 */
import type { SandBox } from '../../interfaces';
import { SandBoxType } from '../../interfaces';
import { rebindTarget2Fn } from '../common';
import { LogPrefix, info } from '../../debugInfo';

// 判断 window 对象的属性是否可配置
function isPropConfigurable(target: WindowProxy, prop: PropertyKey) {
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */
export default class LegacySandbox implements SandBox {
  /** 沙箱期间新增的全局变量 */
  private addedPropsMapInSandbox = new Map<PropertyKey, any>();

  /** 沙箱期间更新的全局变量 */
  private modifiedPropsOriginalValueMapInSandbox = new Map<PropertyKey, any>();

  /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
  private currentUpdatedPropsValueMap = new Map<PropertyKey, any>();

  name: string;

  proxy: WindowProxy;

  globalContext: typeof window;

  type: SandBoxType;

  sandboxRunning = true;

  latestSetProp: PropertyKey | null = null;

  private setWindowProp(prop: PropertyKey, value: any, toDelete?: boolean) {
    // 如果值为 undefined 且需要删除，则删除该属性
    if (value === undefined && toDelete) {
      // eslint-disable-next-line no-param-reassign
      delete (this.globalContext as any)[prop];
      // 如果属性可配置并且不是 symbol，则定义该属性
    } else if (isPropConfigurable(this.globalContext, prop) && typeof prop !== 'symbol') {
      // 将属性定义为可配置，否则无法删除
      Object.defineProperty(this.globalContext, prop, { writable: true, configurable: true });
      // 设置属性值
      // eslint-disable-next-line no-param-reassign
      (this.globalContext as any)[prop] = value;
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
    // 恢复微应用激活期间新增和修改的全局变量
    this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => this.setWindowProp(p, v));
    // 删除微应用激活期间新增的全局变量
    // 注意必须将属性的描述符 configurable 设置为 true，否则无法删除
    this.addedPropsMapInSandbox.forEach((_, p) => this.setWindowProp(p, undefined, true));

    this.sandboxRunning = false;
  }

  constructor(name: string, globalContext = window) {
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
    const fakeWindow = Object.create(null) as Window;

    const setTrap = (p: PropertyKey, value: any, originalValue: any, sync2Window = true) => {
      if (this.sandboxRunning) {
        // 如果原始 window 对象不存在该属性，则记录到新增属性 map 中
        if (!rawWindow.hasOwnProperty(p)) {
          addedPropsMapInSandbox.set(p, value);
          info(LogPrefix.LEGACY_SANDBOX + `[set][addedPropsMapInSandbox][${String(p)}] 设置的值: `, value);
          // 如果不是新增属性，说明属性存在于 window 对象中，那么记录到修改属性 map 中
          // 如果在修改属性 map 中已经记录过该属性，则不再记录
        } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
          // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
          modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
          info(
            LogPrefix.LEGACY_SANDBOX + `[set][modifiedPropsOriginalValueMapInSandbox][${String(p)}] 设置的值: `,
            value,
          );
        }

        // 无论是新增属性还是修改属性，都记录到当前更新属性 map 中
        currentUpdatedPropsValueMap.set(p, value);

        // 同步到原始 window 对象中
        if (sync2Window) {
          // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          (rawWindow as any)[p] = value;
        }

        // 记录最后一次更新的属性
        // 这里主要用于识别微应用导出的生命周期函数
        this.latestSetProp = p;

        return true;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
      }

      // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
      return true;
    };

    // 微应用访问的 window 对象，本质上是这里的 proxy 代理对象
    const proxy = new Proxy(fakeWindow, {
      set: (_: Window, p: PropertyKey, value: any): boolean => {
        const originalValue = (rawWindow as any)[p];
        return setTrap(p, value, originalValue, true);
      },

      get(_: Window, p: PropertyKey): any {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13

        // 避免使用 window.window 或 window.self 来逃逸沙箱环境以触达主应用的 window 对象
        // 或使用 window.top 来检查是否在 iframe 环境中
        if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
          info(LogPrefix.LEGACY_SANDBOX, `[get][${String(p)}] 访问 proxy 代理对象`);
          return proxy;
        }

        const value = (rawWindow as any)[p];
        info(LogPrefix.LEGACY_SANDBOX + `[get][${String(p)}] 访问的值: `, value);
        return rebindTarget2Fn(rawWindow, value);
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(_: Window, p: string | number | symbol): boolean {
        info(LogPrefix.LEGACY_SANDBOX, `[has][拦截 in 和 with 操作符] has ${String(p)}`);
        return p in rawWindow;
      },

      getOwnPropertyDescriptor(_: Window, p: PropertyKey): PropertyDescriptor | undefined {
        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);

        // 详见：https://stackoverflow.com/questions/40921884/create-dynamic-non-configurable-properties-using-proxy
        // 详见：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor#invariants
        // 详见：https://262.ecma-international.org/7.0/#sec-invariants-of-the-essential-internal-methods

        // 如果属性不存在，那么不能将其设置为不可配置

        // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      },

      defineProperty(_: Window, p: string | symbol, attributes: PropertyDescriptor): boolean {
        // 获取原始值
        const originalValue = (rawWindow as any)[p];
        // 定义属性
        const done = Reflect.defineProperty(rawWindow, p, attributes);
        // 获取新值
        const value = (rawWindow as any)[p];
        setTrap(p, value, originalValue, false);

        return done;
      },
    });

    this.proxy = proxy;
  }

  patchDocument(): void {}
}
