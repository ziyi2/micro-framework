/**
 * @author Kuitos
 * @since 2020-05-15
 */
export default function getAddOn(global) {
  return {
    async beforeLoad() {
      // eslint-disable-next-line no-param-reassign
      // 这里的 global 如果是 ProxySandbox 的话，会被代理，所以这里的赋值会触发代理的 set 操作
      global.__POWERED_BY_QIANKUN__ = true;
    },
    async beforeMount() {
      // eslint-disable-next-line no-param-reassign
      global.__POWERED_BY_QIANKUN__ = true;
    },
    async beforeUnmount() {
      // eslint-disable-next-line no-param-reassign
      delete global.__POWERED_BY_QIANKUN__;
    },
  };
}
