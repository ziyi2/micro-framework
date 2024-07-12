// 微应用容器元素的 ID
export const MICRO_APP_CONTAINER_ID = "micro-app-container";

export const MICRO_APP_ROUTER = {
  REACT: "react",
  VUE: "vue",
};

// // single-spa 微应用数据
// // 菜单信息，这里用于 Mock 后端数据
// // 真实业务可能是一个树状的带权限的菜单信息
// export const mockMicroApps: IMicroApp[] = [
//   {
//     // 应用标识
//     name: "react",
//     // 菜单名称
//     title: "React Micro App",
//     // 应用地址
//     entry: [
//       "http://localhost:3000/vendors.js",
//       "http://localhost:3000/main.js",
//     ],
//     // 激活路由
//     activeWhen: MICRO_APP_ROUTER.REACT,
//     customProps: {
//       // 向微应用传递需要挂载的容器元素 ID
//       container: MICRO_APP_CONTAINER_ID,
//     },
//   },
//   {
//     name: "vue",
//     title: "Vue Micro App",
//     entry: [
//       "http://localhost:8080/js/chunk-vendors.js",
//       "http://localhost:8080/js/app.js",
//     ],
//     activeWhen: MICRO_APP_ROUTER.VUE,
//     customProps: {
//       // 向微应用传递需要挂载的容器元素 ID
//       container: MICRO_APP_CONTAINER_ID,
//     },
//   },
// ];

// qiankun 微应用数据
// 菜单信息，这里用于 Mock 后端数据
// 真实业务可能是一个树状的带权限的菜单信息
export const mockMicroApps = [
  {
    // 应用标识
    name: "react",
    // 菜单名称
    title: "React Micro App",
    // 应用地址
    // 使用 Fetch 请求并解析 HTML，因此必须能够支持跨域
    entry: "http://localhost:3000",
    // entry: {
    //   scripts: [
    //     "http://localhost:3000/vendors.js",
    //     "http://localhost:3000/main.js",
    //   ],
    //   html: `<div id="${MICRO_APP_ROUTER.REACT}"></div>`,
    // },
    // 对应 single-spa 的 activeWhen
    // 激活路由
    activeRule: MICRO_APP_ROUTER.REACT,
    container: `#${MICRO_APP_CONTAINER_ID}`,
    // 对应 single-spa 的 customProps
    // props: {
    //   microContainer: MICRO_APP_ROUTER.REACT,
    // },
  },
  {
    name: "vue",
    title: "Vue Micro App",
    entry: "http://localhost:8080",
    // entry: {
    //   scripts: [
    //     "http://localhost:8080/js/chunk-vendors.js",
    //     "http://localhost:8080/js/app.js",
    //   ],
    //   // 新增抽离的 styles 样式
    //   styles: ["http://localhost:8080/css/app.css"],
    //   html: `<div id="${MICRO_APP_ROUTER.VUE}"></div>`,
    // },
    activeRule: MICRO_APP_ROUTER.VUE,
    container: `#${MICRO_APP_CONTAINER_ID}`,
    // props: {
    //   microContainer: MICRO_APP_ROUTER.VUE,
    // },
  },
];
