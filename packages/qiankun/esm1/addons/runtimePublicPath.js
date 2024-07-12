const rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
export default function getAddOn(global, publicPath = '/') {
  let hasMountedOnce = false;
  return {
    async beforeLoad() {
      // eslint-disable-next-line no-param-reassign
      // 这里的 global 如果是 ProxySandbox 的话，会被代理，所以这里的赋值会触发代理的 set 操作
      global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
    },
    async beforeMount() {
      if (hasMountedOnce) {
        // eslint-disable-next-line no-param-reassign
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
      }
    },
    async beforeUnmount() {
      if (rawPublicPath === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
      } else {
        // eslint-disable-next-line no-param-reassign
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
      }
      hasMountedOnce = true;
    },
  };
}
