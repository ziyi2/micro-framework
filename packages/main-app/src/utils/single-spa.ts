// 这里使用 npm link 进行连接调试
import { start, registerApplication } from "single-spa/src/single-spa";
import { LifeCycles, RegisterApplicationConfig } from "single-spa";

// 对 single-spa 的 registerApplication 进行二次封装，使其可以接收一个数组，批量注册子应用
export function registerMicroApps(apps: RegisterApplicationConfig[]) {
  // @ts-ignore
  // 如果不开启 __DEV__，single-spa 的源码无法正常运行
  window.__DEV__ = true;
  apps.forEach(registerApplication);
  start();
}

export function getAppLifeCycles() {
  // 使用 UMD 进行子应用的构建，挂载全局变量的动作是在内部微应用的代码执行完毕后
  // 例如 root["myLibrary"] = factory(), 这里的 factory 包含了内部微应用代码的执行
  // 因此这里通过遍历全局对象的属性顺序拿到子应用的生命周期函数

  // Object.keys 可以获取到对象的属性
  // 对象自身属性的返回顺序查看 ECMAScript 2015 标准：
  // https://262.ecma-international.org/6.0/?_gl=1*1tycd0l*_ga*NDQ5NTkxOTguMTcwMTc0MzUwMg..*_ga_TDCK4DWEPP*MTcwMTc0MzUwMS4xLjEuMTcwMTc0MzcxMy4wLjAuMA..&_ga=2.173157030.426159955.1701743502-44959198.1701743502#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys

  // 按照这个规范，Object.keys() 的返回顺序如下：

  // 数字键（整数索引），按照升序排列。
  // 字符串键，按照它们被添加到对象的顺序。
  // 符号键，按照它们被添加到对象的顺序。
  // 由于 Object.keys() 只返回字符串键，因此只需要关心数字键和字符串键。
  // 数字键会被视为数组索引并按照数值升序排列，而字符串键则会按照它们创建时的顺序排列。
  // 符号键不会被 Object.keys() 返回，但如果要获取它们，可以使用 Object.getOwnPropertySymbols()。

  // 注意，这里的“数字键”指的是那些可被转换为32位无符号整数的字符串键，它们属于数组索引的范围，即在0到2^32-1之间的整数。
  // 对于这些数字键，即使它们是作为对象的属性添加的，它们也会被当作数组索引并按照数值排序。其他非数字的字符串键则按照它们添加到对象的顺序进行枚举。

  // 需要注意和 for...in 的区别，for...in 还能遍历原型链上的属性

  // for...in
  // https://262.ecma-international.org/6.0/?_gl=1*1tycd0l*_ga*NDQ5NTkxOTguMTcwMTc0MzUwMg..*_ga_TDCK4DWEPP*MTcwMTc0MzUwMS4xLjEuMTcwMTc0MzcxMy4wLjAuMA..&_ga=2.173157030.426159955.1701743502-44959198.1701743502#sec-for-in-and-for-of-statements-static-semantics-early-errors

  const keys = Object.keys(window);
  const lifeCycles = window[keys[keys.length - 1]];
  console.info(
    "%c当前 window 对象的最后一个属性是：%c" + keys[keys.length - 1],
    "color: blue; font-weight: bold; font-size: 20px;",
    "color: red; font-weight: bold; font-size: 20px;"
  );
  return lifeCycles as LifeCycles;
}

export async function fetchApp(urls: string[]) {
  for (let url of urls) {
    const res = await window.fetch(url);
    const text = await res.text();
    // 使用 eval 执行
    (0, eval)(text);
  }

  // 执行微应用的代码后立即获取对应的生命周期函数
  return getAppLifeCycles();
}
