import { IRegisterApp } from "micro-framework";

interface IMockApp extends IRegisterApp {
  title: string;
  container: string;
  activeWhen: string;
}

// 微应用容器元素的 ID
export const MICRO_APP_CONTAINER_ID = "micro-app-container";

export const MICRO_APP_ROUTER = {
  REACT: "react",
  VUE: "vue",
};

// 菜单信息，这里用于 Mock 后端数据
// 真实业务可能是一个树状的带权限的菜单信息
export const mockMicroApps: IMockApp[] = [
  {
    // 应用标识
    name: "react",
    // 菜单名称
    title: "React Micro App",
    // 应用地址: Fetch 请求并解析 HTML，因此必须能够支持跨域
    entry: "http://localhost:4040",
    // 对应 single-spa 的 activeWhen
    activeWhen: MICRO_APP_ROUTER.REACT,
    container: `#${MICRO_APP_CONTAINER_ID}`,
  },
  {
    name: "vue",
    title: "Vue Micro App",
    entry: "http://localhost:8080",
    activeWhen: MICRO_APP_ROUTER.VUE,
    container: `#${MICRO_APP_CONTAINER_ID}`,
  },
];
