// 微应用容器元素的 ID
export const MICRO_APP_CONTAINER_ID = "micro-app-container";

export const MICRO_APP_ROUTER = {
  REACT: "react",
  VUE: "vue",
};

// single-spa 微应用数据
// 菜单信息，这里用于 Mock 后端数据
// 真实业务可能是一个树状的带权限的菜单信息
export const mockMicroApps = [
  {
    // 应用标识
    name: "react",
    // 菜单名称
    title: "React Micro App",
    // 应用地址
    entry: "http://localhost:3000",
    // 激活路由
    activeWhen: MICRO_APP_ROUTER.REACT,
    customProps: {
      // 向微应用传递需要挂载的容器元素 ID
      container: MICRO_APP_CONTAINER_ID,
    },
  },
  {
    name: "vue",
    title: "Vue Micro App",
    entry: "http://localhost:8080",
    activeWhen: MICRO_APP_ROUTER.VUE,
    customProps: {
      // 向微应用传递需要挂载的容器元素 ID
      container: MICRO_APP_CONTAINER_ID,
    },
  },
];
