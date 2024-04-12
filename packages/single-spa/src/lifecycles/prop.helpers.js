import * as singleSpa from "../single-spa.js";
import { mountParcel } from "../parcels/mount-parcel.js";
import { assign } from "../utils/assign.js";
import { isParcel, toName } from "../applications/app.helpers.js";
import { formatErrorMessage } from "../applications/app-errors.js";

/**
 * @description 获取微应用生命周期函数的执行参数 props（主应用传递给微应用）
 * @export
 * @param appOrParcel 微应用信息
 * @returns {*} 带有微应用名称、mountParcel、singleSpa 的 props 以及 customProps
 */
export function getProps(appOrParcel) {
  // 获取微应用名称
  const name = toName(appOrParcel);
  // 获取微应用的 customProps
  let customProps =
    typeof appOrParcel.customProps === "function"
      ? appOrParcel.customProps(name, window.location)
      : appOrParcel.customProps;
  // 如果 customProps 不是对象或者是 null 或者是数组，将 customProps 设置为 {}
  if (
    typeof customProps !== "object" ||
    customProps === null ||
    Array.isArray(customProps)
  ) {
    customProps = {};
    console.warn(
      formatErrorMessage(
        40,
        __DEV__ &&
          `single-spa: ${name}'s customProps function must return an object. Received ${customProps}`
      ),
      name,
      customProps
    );
  }
  // 返回带有微应用名称、mountParcel、singleSpa 的 props 以及 customProps
  const result = assign({}, customProps, {
    name,
    mountParcel: mountParcel.bind(appOrParcel),
    singleSpa,
  });

  // 在当前示例中没有使用 Parcel 的能力，所以不需要返回 unmountSelf
  if (isParcel(appOrParcel)) {
    result.unmountSelf = appOrParcel.unmountThisParcel;
  }

  return result;
}
