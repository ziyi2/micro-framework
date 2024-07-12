/**
 * @author Kuitos
 * @since 2019-11-12
 */
import type { FrameworkLifeCycles } from '../interfaces';

const rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;

export default function getAddOn(global: Window, publicPath = '/'): FrameworkLifeCycles<any> {
  let hasMountedOnce = false;

  return {
    async beforeLoad() {
      // 在加载前设置 __INJECTED_PUBLIC_PATH_BY_QIANKUN__ 为 publicPath
      // eslint-disable-next-line no-param-reassign
      global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
    },

    async beforeMount() {
      // 如果已经挂载过一次, 则设置 __INJECTED_PUBLIC_PATH_BY_QIANKUN__ 为 publicPath
      if (hasMountedOnce) {
        // eslint-disable-next-line no-param-reassign
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
      }
    },

    async beforeUnmount() {
      // 如果 rawPublicPath 为 undefined, 则删除 __INJECTED_PUBLIC_PATH_BY_QIANKUN__
      if (rawPublicPath === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
        // 否则设置 __INJECTED_PUBLIC_PATH_BY_QIANKUN__ 为 rawPublicPath
      } else {
        // eslint-disable-next-line no-param-reassign
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
      }

      hasMountedOnce = true;
    },
  };
}
