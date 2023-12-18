export const MICRO_APP_CONTAINER_ID = "micro-app-container";

export const MICRO_APP_ROUTER = {
  REACT: "react",
  VUE: "vue",
};

// 菜单信息，这里用于 Mock 后端数据
// 真实业务可能是一个树状的带权限的菜单信息
export const mockMicroApps = [
  {
    name: "react",
    title: "React Micro App",
    app: "react-micro-app",
    router: MICRO_APP_ROUTER.REACT,
  },
  {
    name: "vue",
    title: "Vue Micro App",
    app: "vue-micro-app",
    router: MICRO_APP_ROUTER.VUE,
  },
];
