/**
 * @author Kuitos
 * @since 2020-03-02
 */

import { concat, mergeWith } from 'lodash';
import type { FrameworkLifeCycles, ObjectType } from '../interfaces';
import getEngineFlagAddon from './engineFlag';
import getRuntimePublicPathAddOn from './runtimePublicPath';

// global: 全局对象
// publicPath: 公共路径, 例如: http://localhost:8080/
export default function getAddOns<T extends ObjectType>(global: Window, publicPath: string): FrameworkLifeCycles<T> {
  // getEngineFlagAddon: 获取 qiankun 内置的生命周期钩子，用于设置 __POWERED_BY_QIANKUN__ 标识
  // 在微应用中可以通过 window.__POWERED_BY_QIANKUN__ 判断当前应用是否是在 qiankun 中运行
  // {
  //   async beforeLoad() {
  //     // eslint-disable-next-line no-param-reassign
  //     global.__POWERED_BY_QIANKUN__ = true;
  //   },

  //   async beforeMount() {
  //     // eslint-disable-next-line no-param-reassign
  //     global.__POWERED_BY_QIANKUN__ = true;
  //   },

  //   async beforeUnmount() {
  //     // eslint-disable-next-line no-param-reassign
  //     delete global.__POWERED_BY_QIANKUN__;
  //   },
  // }

  // getRuntimePublicPathAddOn: 获取 qiankun 内置的生命周期钩子，用于设置 __INJECTED_PUBLIC_PATH_BY_QIANKUN__ 标识
  // 在微应用中可以通过 window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ 获取当前微应用的 publicPath

  // mergeWith: https://lodash.com/docs/4.17.15#mergeWith
  // mergeWith: 合并多个对象, 如果多个对象的属性值都是数组, 则合并这两个数组
  //            最后一个参数是一个 customizer 函数, 用于自定义合并规则，这里使用 lodash 的 concat 方法，将两个数组合并

  // 为了有助于理解，这里打印运行信息
  // 首先是 {} 和 getEngineFlagAddon(global) 进行合并
  // 然后是两者的合并结果和 getRuntimePublicPathAddOn(global, publicPath) 进行合并
  const result = mergeWith({}, getEngineFlagAddon(global), getRuntimePublicPathAddOn(global, publicPath), (v1, v2) => {
    console.log('v1: ', v1);
    console.log('v2: ', v2);
    console.log('concat(v1 ?? [], v2 ?? []): ', concat(v1 ?? [], v2 ?? []));
    // 依次遍历合并对象的每一个属性，v1 和 v2 分别是两个对象的属性值
    // 首次使用 {} 合并时 v1 ?? [] 的结果都为 []，
    // v2 依次是 getEngineFlagAddon(global) 的结果, 也就是 beforeLoad, beforeMount, beforeUnmount
    // 所以使用 concat 合并后的结果依次为 [beforeLoad], [beforeMount], [beforeUnmount]

    // 第二次合并时 v1 分别是上一次合并的结果 [beforeLoad], [beforeMount], [beforeUnmount]
    // v2 依次是 getRuntimePublicPathAddOn(global, publicPath) 的结果, 也就是 beforeLoad, beforeMount, beforeUnmount

    // 所以使用 concat 合并后的结果依次为 [beforeLoad, beforeLoad], [beforeMount, beforeMount], [beforeUnmount, beforeUnmount]
    return concat(v1 ?? [], v2 ?? []);
  });

  // 输出结果，简单理解为将每一个对象的相同属性值合并为一个数组

  // 其中 [beforeLoad, beforeLoad] 中的第一个 beforeLoad 是 getEngineFlagAddon(global) 中的 beforeLoad
  // 第二个 beforeLoad 是 getRuntimePublicPathAddOn(global, publicPath) 中的 beforeLoad

  // { beforeLoad: [beforeLoad, beforeLoad], beforeMount: [beforeMount, beforeMount], beforeUnmount: [beforeUnmount, beforeUnmount]}
  console.log('result: ', result);

  return mergeWith({}, getEngineFlagAddon(global), getRuntimePublicPathAddOn(global, publicPath), (v1, v2) =>
    // ??: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
    // concat: https://lodash.com/docs/4.17.15#concat
    concat(v1 ?? [], v2 ?? []),
  );
}
