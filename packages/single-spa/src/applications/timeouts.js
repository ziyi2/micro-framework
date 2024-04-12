import { assign } from "../utils/assign";
import { getProps } from "../lifecycles/prop.helpers";
import { objectType, toName } from "./app.helpers";
import { formatErrorMessage } from "./app-errors";

const defaultWarningMillis = 1000;

const globalTimeoutConfig = {
  bootstrap: {
    millis: 4000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  mount: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  unmount: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  unload: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
  update: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis,
  },
};

export function setBootstrapMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        16,
        __DEV__ &&
          `bootstrap max time must be a positive integer number of milliseconds`
      )
    );
  }

  globalTimeoutConfig.bootstrap = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

export function setMountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        17,
        __DEV__ &&
          `mount max time must be a positive integer number of milliseconds`
      )
    );
  }

  globalTimeoutConfig.mount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

export function setUnmountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        18,
        __DEV__ &&
          `unmount max time must be a positive integer number of milliseconds`
      )
    );
  }

  globalTimeoutConfig.unmount = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

export function setUnloadMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(
      formatErrorMessage(
        19,
        __DEV__ &&
          `unload max time must be a positive integer number of milliseconds`
      )
    );
  }

  globalTimeoutConfig.unload = {
    millis: time,
    dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis,
  };
}

/**
 * @description 执行微应用的生命周期函数，并且设置超时时间
 * @export
 * @param appOrParcel 微应用信息
 * @param lifecycle 生命周期名称，例如：bootstrap、mount、unmount、unload
 * @returns {*}
 */
export function reasonableTime(appOrParcel, lifecycle) {
  console.log(
    "[applications/timeouts.js - reasonableTime]: 开始执行 reasonableTime 函数...",
    appOrParcel.name,
    appOrParcel.status,
    lifecycle
  );

  // 获取微应用的超时配置
  const timeoutConfig = appOrParcel.timeouts[lifecycle];
  // 获取超时时间
  const warningPeriod = timeoutConfig.warningMillis;
  const type = objectType(appOrParcel);

  // 返回一个 Promise 对象
  return new Promise((resolve, reject) => {
    let finished = false;
    let errored = false;

    console.log(
      `[applications/timeouts.js - reasonableTime]: 开始执行子应用的 ${lifecycle} 函数...`,
      appOrParcel.name,
      appOrParcel.status,
      getProps(appOrParcel)
    );

    // 执行微应用的生命周期函数
    // 在 toLoadPromise 函数中，已经获取并解析了微应用的生命周期函数，并且将其缓存到 app 对象中
    // 因此在这里可以执行 appOrParcel[lifecycle]

    // 和在 toLoadPromise 中执行 app.loadApp 函数一样，生命周期函数的执行也需要传入 props 参数（这是实现主应用和微应用通信的主要方式）
    appOrParcel[lifecycle](getProps(appOrParcel))
      .then((val) => {
        // 如果生命周期函数执行成功，将 finished 设置为 true，并且调用 resolve 函数
        finished = true;
        resolve(val);
      })
      .catch((val) => {
        finished = true;
        reject(val);
      });

    // 超时处理
    setTimeout(() => maybeTimingOut(1), warningPeriod);
    // 超时处理
    setTimeout(() => maybeTimingOut(true), timeoutConfig.millis);

    const errMsg = formatErrorMessage(
      31,
      __DEV__ &&
        `Lifecycle function ${lifecycle} for ${type} ${toName(
          appOrParcel
        )} lifecycle did not resolve or reject for ${timeoutConfig.millis} ms.`,
      lifecycle,
      type,
      toName(appOrParcel),
      timeoutConfig.millis
    );

    function maybeTimingOut(shouldError) {
      // 如果 finished 为 true，说明生命周期函数执行成功，不需要处理超时
      if (!finished) {
        if (shouldError === true) {
          errored = true;
          if (timeoutConfig.dieOnTimeout) {
            reject(Error(errMsg));
          } else {
            console.error(errMsg);
            //don't resolve or reject, we're waiting this one out
          }
        } else if (!errored) {
          const numWarnings = shouldError;
          const numMillis = numWarnings * warningPeriod;
          console.warn(errMsg);
          if (numMillis + warningPeriod < timeoutConfig.millis) {
            setTimeout(() => maybeTimingOut(numWarnings + 1), warningPeriod);
          }
        }
      }
    }
  });
}

export function ensureValidAppTimeouts(timeouts) {
  const result = {};

  for (let key in globalTimeoutConfig) {
    result[key] = assign(
      {},
      globalTimeoutConfig[key],
      (timeouts && timeouts[key]) || {}
    );
  }

  return result;
}
