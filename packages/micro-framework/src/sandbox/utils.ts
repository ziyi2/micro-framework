import { memoize } from "lodash";

const frozenPropertyCacheMap = new WeakMap<any, Record<PropertyKey, boolean>>();
export function isPropertyFrozen(target: any, p?: PropertyKey): boolean {
  if (!target || !p) {
    return false;
  }

  const targetPropertiesFromCache = frozenPropertyCacheMap.get(target) || {};

  if (targetPropertiesFromCache[p]) {
    return targetPropertiesFromCache[p];
  }

  const propertyDescriptor = Object.getOwnPropertyDescriptor(target, p);
  const frozen = Boolean(
    propertyDescriptor &&
      propertyDescriptor.configurable === false &&
      (propertyDescriptor.writable === false ||
        (propertyDescriptor.get && !propertyDescriptor.set))
  );

  targetPropertiesFromCache[p] = frozen;
  frozenPropertyCacheMap.set(target, targetPropertiesFromCache);

  return frozen;
}

const callableFnCacheMap = new WeakMap<CallableFunction, boolean>();
export function isCallable(fn: any): boolean {
  if (callableFnCacheMap.has(fn)) {
    return true;
  }

  /**
   * We can not use typeof to confirm it is function as in some safari version
   * typeof document.all === 'undefined' // true
   * typeof document.all === 'function' // true
   */
  const callable = typeof fn === "function" && fn instanceof Function;
  if (callable) {
    callableFnCacheMap.set(fn, callable);
  }
  return callable;
}

const boundedMap = new WeakMap<CallableFunction, boolean>();

export function isBoundedFunction(fn: CallableFunction) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  const bounded =
    fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype");
  boundedMap.set(fn, bounded);
  return bounded;
}

const fnRegexCheckCacheMap = new WeakMap<any | FunctionConstructor, boolean>();

export function isConstructable(fn: () => any | FunctionConstructor) {
  // prototype methods might be changed while code running, so we need check it every time
  const hasPrototypeMethods =
    fn.prototype &&
    fn.prototype.constructor === fn &&
    Object.getOwnPropertyNames(fn.prototype).length > 1;

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
    constructable =
      constructableFunctionRegex.test(fnString) || classRegex.test(fnString);
  }

  fnRegexCheckCacheMap.set(fn, constructable);
  return constructable;
}

const functionBoundedValueMap = new WeakMap<
  CallableFunction,
  CallableFunction
>();

export function rebindTarget2Fn(target: any, fn: any): any {
  /*
      仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类，不然微应用中调用时会抛出 Illegal invocation 异常
      目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
      @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
     */
  if (isCallable(fn) && !isBoundedFunction(fn) && !isConstructable(fn)) {
    const cachedBoundFunction = functionBoundedValueMap.get(fn);
    if (cachedBoundFunction) {
      return cachedBoundFunction;
    }

    const boundValue = Function.prototype.bind.call(fn, target);

    // some callable function has custom fields, we need to copy the own props to boundValue. such as moment function.
    Object.getOwnPropertyNames(fn).forEach((key) => {
      // boundValue might be a proxy, we need to check the key whether exist in it
      if (!boundValue.hasOwnProperty(key)) {
        Object.defineProperty(
          boundValue,
          key,
          Object.getOwnPropertyDescriptor(fn, key)!
        );
      }
    });

    // copy prototype if bound function not have but target one have
    // as prototype is non-enumerable mostly, we need to copy it from target function manually
    if (
      fn.hasOwnProperty("prototype") &&
      !boundValue.hasOwnProperty("prototype")
    ) {
      // we should not use assignment operator to set boundValue prototype like `boundValue.prototype = fn.prototype`
      // as the assignment will also look up prototype chain while it hasn't own prototype property,
      // when the lookup succeed, the assignment will throw an TypeError like `Cannot assign to read only property 'prototype' of function` if its descriptor configured with writable false or just have a getter accessor
      // see https://github.com/umijs/qiankun/issues/1121
      Object.defineProperty(boundValue, "prototype", {
        value: fn.prototype,
        enumerable: false,
        writable: true,
      });
    }

    // Some util, like `function isNative() {  return typeof Ctor === 'function' && /native code/.test(Ctor.toString()) }` relies on the original `toString()` result
    // but bound functions will always return "function() {[native code]}" for `toString`, which is misleading
    if (typeof fn.toString === "function") {
      const valueHasInstanceToString =
        fn.hasOwnProperty("toString") && !boundValue.hasOwnProperty("toString");
      const boundValueHasPrototypeToString =
        boundValue.toString === Function.prototype.toString;

      if (valueHasInstanceToString || boundValueHasPrototypeToString) {
        const originToStringDescriptor = Object.getOwnPropertyDescriptor(
          valueHasInstanceToString ? fn : Function.prototype,
          "toString"
        );

        Object.defineProperty(
          boundValue,
          "toString",
          Object.assign(
            {},
            originToStringDescriptor,
            originToStringDescriptor?.get
              ? null
              : { value: () => fn.toString() }
          )
        );
      }
    }

    functionBoundedValueMap.set(fn, boundValue);
    return boundValue;
  }

  return fn;
}

/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
export function uniq(array: Array<string | symbol>) {
  return array.filter(function filter(this: PropertyKey[], element) {
    return element in this ? false : ((this as any)[element] = true);
  }, Object.create(null));
}
