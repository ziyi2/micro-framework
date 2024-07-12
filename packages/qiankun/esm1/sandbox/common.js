/**
 * @author Kuitos
 * @since 2020-04-13
 */
import { isBoundedFunction, isCallable, isConstructable } from '../utils';
let currentRunningApp = null;
/**
 * get the app that running tasks at current tick
 */
export function getCurrentRunningApp() {
  return currentRunningApp;
}
export function setCurrentRunningApp(appInstance) {
  // Set currentRunningApp and it's proxySandbox to global window, as its only use case is for document.createElement from now on, which hijacked by a global way
  currentRunningApp = appInstance;
}
export function clearCurrentRunningApp() {
  currentRunningApp = null;
}
const functionBoundedValueMap = new WeakMap();
export function rebindTarget2Fn(target, fn) {
  /*
      仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类，不然微应用中调用时会抛出 Illegal invocation 异常
      目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
      @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
     */
  if (isCallable(fn) && !isBoundedFunction(fn) && !isConstructable(fn)) {
    // 获取缓存的绑定函数
    const cachedBoundFunction = functionBoundedValueMap.get(fn);
    // 如果存在缓存的绑定函数，则直接返回
    if (cachedBoundFunction) {
      return cachedBoundFunction;
    }
    // 通过 Function.prototype.bind 方法将 fn 绑定到 target 上
    const boundValue = Function.prototype.bind.call(fn, target);
    // some callable function has custom fields, we need to copy the own props to boundValue. such as moment function.
    Object.getOwnPropertyNames(fn).forEach((key) => {
      // boundValue might be a proxy, we need to check the key whether exist in it
      if (!boundValue.hasOwnProperty(key)) {
        Object.defineProperty(boundValue, key, Object.getOwnPropertyDescriptor(fn, key));
      }
    });
    // copy prototype if bound function not have but target one have
    // as prototype is non-enumerable mostly, we need to copy it from target function manually
    if (fn.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype')) {
      // we should not use assignment operator to set boundValue prototype like `boundValue.prototype = fn.prototype`
      // as the assignment will also look up prototype chain while it hasn't own prototype property,
      // when the lookup succeed, the assignment will throw an TypeError like `Cannot assign to read only property 'prototype' of function` if its descriptor configured with writable false or just have a getter accessor
      // see https://github.com/umijs/qiankun/issues/1121
      Object.defineProperty(boundValue, 'prototype', { value: fn.prototype, enumerable: false, writable: true });
    }
    // Some util, like `function isNative() {  return typeof Ctor === 'function' && /native code/.test(Ctor.toString()) }` relies on the original `toString()` result
    // but bound functions will always return "function() {[native code]}" for `toString`, which is misleading
    if (typeof fn.toString === 'function') {
      const valueHasInstanceToString = fn.hasOwnProperty('toString') && !boundValue.hasOwnProperty('toString');
      const boundValueHasPrototypeToString = boundValue.toString === Function.prototype.toString;
      if (valueHasInstanceToString || boundValueHasPrototypeToString) {
        const originToStringDescriptor = Object.getOwnPropertyDescriptor(
          valueHasInstanceToString ? fn : Function.prototype,
          'toString',
        );
        Object.defineProperty(
          boundValue,
          'toString',
          Object.assign(
            {},
            originToStringDescriptor,
            originToStringDescriptor?.get ? null : { value: () => fn.toString() },
          ),
        );
      }
    }
    functionBoundedValueMap.set(fn, boundValue);
    return boundValue;
  }
  return fn;
}
