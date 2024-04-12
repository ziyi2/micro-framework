import { find } from "../utils/find.js";
import { objectType, toName } from "../applications/app.helpers.js";
import { formatErrorMessage } from "../applications/app-errors.js";

/**
 * @description 校验生命周期函数是否是函数或者是函数数组
 * @export
 * @param fn 生命周期函数
 * @returns {*} 是否是函数或者是函数数组
 */
export function validLifecycleFn(fn) {
  return fn && (typeof fn === "function" || isArrayOfFns(fn));

  /**
   * @description 校验是否是函数数组
   * @param arr 函数数组
   * @returns {*} 是否是函数数组
   */
  function isArrayOfFns(arr) {
    return (
      Array.isArray(arr) && !find(arr, (item) => typeof item !== "function")
    );
  }
}

/**
 * @description 将函数数组扁平化，依次执行数组中的函数
 * @export
 * @param appOrParcel 微应用信息
 * @param lifecycle 生命周期名称
 * @returns {*}
 */
export function flattenFnArray(appOrParcel, lifecycle) {
  let fns = appOrParcel[lifecycle] || [];
  // 如果 fns 不是数组，将 fns 设置为数组
  fns = Array.isArray(fns) ? fns : [fns];
  if (fns.length === 0) {
    fns = [() => Promise.resolve()];
  }

  const type = objectType(appOrParcel);
  const name = toName(appOrParcel);

  return function (props) {
    // 依次执行 fns 数组中的函数
    return fns.reduce((resultPromise, fn, index) => {
      // 依次执行 fns 数组中的函数，需要注意每一个函数的执行结果必须是 Promise 对象，否则会抛出异常
      // 如果执行结果是 Promise 对象，直接返回 Promise 对象，并且下一个函数会等待当前函数执行完成后再执行
      // 假设 bootstrap 周期函数是一个数组： [async () => {}, async () => {}], 那么第一个函数的 Promise 对象执行完成后，第二个函数才会执行
      return resultPromise.then(() => {
        const thisPromise = fn(props);
        return smellsLikeAPromise(thisPromise)
          ? thisPromise
          : Promise.reject(
              formatErrorMessage(
                15,
                __DEV__ &&
                  `Within ${type} ${name}, the lifecycle function ${lifecycle} at array index ${index} did not return a promise`,
                type,
                name,
                lifecycle,
                index
              )
            );
      });
    }, Promise.resolve());
  };
}

export function smellsLikeAPromise(promise) {
  return (
    promise &&
    typeof promise.then === "function" &&
    typeof promise.catch === "function"
  );
}
