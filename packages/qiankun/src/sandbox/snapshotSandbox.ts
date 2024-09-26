// packages/qiankun/src/sandbox/snapshotSandbox.ts

/**
 * @author Hydrogen
 * @since 2020-3-8
 */
import type { SandBox } from '../interfaces';
import { SandBoxType } from '../interfaces';

// 遍历 window 对象，将 window 对象的自有属性和方法都传入 callbackFn 中
function iter(obj: typeof window, callbackFn: (prop: any) => void) {
  // const obj = {
  //   ownProp: 'I am an own property',
  // };
  // Object.prototype.protoProp = 'I am a prototype property';
  // console.log(obj.hasOwnProperty('ownProp')); // true
  // console.log(obj.hasOwnProperty('protoProp')); // false
  // console.log('protoProp' in obj); // true

  for (const prop in obj) {
    // 如果是对象自身的属性，或者是 clearInterval 方法，就调用 callbackFn
    // patch for clearInterval for compatible reason, see #1490

    // 为什么这里要判断 obj.hasOwnProperty(prop)？
    // 1. 通常情况下我们在设计微应用代码时，不会直接修改 window 对象的原型链上的属性，而是直接修改 window 对象自身的属性
    // 2. 原型链上的属性是共享的，如果记录了原型链上的属性，那么在恢复环境时，会影响到其他应用
    // 3. 可以减少快照沙箱的内存占用提高处理性能
    // 4. 处理原型链上的属性会增加复杂度，因为需要遍历整个原型链

    // 为什么这里要判断 clearInterval 方法？
    // 详见：https://github.com/umijs/qiankun/issues/872

    // 在开启沙箱之前，会 patch window 对象的 setInterval 和 clearInterval 方法
    // 详见 src/sandbox/patchers/interval.ts
    if (obj.hasOwnProperty(prop) || prop === 'clearInterval') {
      callbackFn(prop);
    }
  }
}

/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */
export default class SnapshotSandbox implements SandBox {
  proxy: WindowProxy;

  name: string;

  type: SandBoxType;

  sandboxRunning = true;

  private windowSnapshot!: Window;

  private modifyPropsMap: Record<any, any> = {};

  constructor(name: string) {
    this.name = name;
    // proxy 是 window 对象的代理对象
    // 在快照沙箱中，没有 proxy 代理功能，所以这里直接将 window 对象赋值给 proxy
    this.proxy = window;
    this.type = SandBoxType.Snapshot;
  }

  // 微应用 mount 时触发，注意在微应用生命周期函数 mount 之前调用
  active() {
    // 记录当前快照
    this.windowSnapshot = {} as Window;
    iter(window, (prop) => {
      // 遍历 window 对象，记录微应用 mount 执行前的 window 快照
      this.windowSnapshot[prop] = window[prop];
    });

    // 恢复之前的变更（注意每一个微应用都会 new 一个新的 SnapshotSandbox 沙箱实例，所以这里的 modifyPropsMap 和微应用一一对应）
    // 这里的 modifyPropsMap 记录的是上一次微应用执行期间 window 对象的属性变更
    Object.keys(this.modifyPropsMap).forEach((p: any) => {
      window[p] = this.modifyPropsMap[p];
    });

    this.sandboxRunning = true;
  }

  // 微应用 unmount 时触发，注意在微应用生命周期函数 unmount 之后调用
  inactive() {
    this.modifyPropsMap = {};
    iter(window, (prop) => {
      // 微应用卸载后，此时 window 对象可能存在一些属性被修改，需要将这些属性恢复到微应用 mount 执行前的快照
      if (window[prop] !== this.windowSnapshot[prop]) {
        // 记录微应用执行期间 window 对象的属性变更
        this.modifyPropsMap[prop] = window[prop];
        // 恢复 window 对象的快照
        window[prop] = this.windowSnapshot[prop];
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap));
    }

    this.sandboxRunning = false;
  }

  patchDocument(): void {}
}
