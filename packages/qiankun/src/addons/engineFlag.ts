/**
 * @author Kuitos
 * @since 2020-05-15
 */

import type { FrameworkLifeCycles } from '../interfaces';

export default function getAddOn(global: Window): FrameworkLifeCycles<any> {
  return {
    async beforeLoad() {
      // 在加载前设置 __POWERED_BY_QIANKUN__ 为 true
      // eslint-disable-next-line no-param-reassign
      global.__POWERED_BY_QIANKUN__ = true;
    },

    async beforeMount() {
      // 在挂载前设置 __POWERED_BY_QIANKUN__ 为 true
      // eslint-disable-next-line no-param-reassign
      global.__POWERED_BY_QIANKUN__ = true;
    },

    async beforeUnmount() {
      // 在卸载前删除 __POWERED_BY_QIANKUN__
      // eslint-disable-next-line no-param-reassign
      delete global.__POWERED_BY_QIANKUN__;
    },
  };
}
