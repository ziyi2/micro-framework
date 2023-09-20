// 获取包描述信息
const packageJson = require("../../package.json");

module.exports = {
  // 配置网站标题
  title: packageJson.name,
  // 配置网站描述
  description: packageJson.description,
  // 配置基本路径
  base: "/micro-framework/",
  // 配置基本端口
  port: "8080",
  themeConfig: {
    // 配置导航链接
    nav: [
      { text: "开发指南", link: "/guide/introduction" },
      { text: "API", link: "/api/" },
      { text: "变更日志", link: "/changelog.html" },
      // 导航还可以配置下拉列表, 例如不同的版本如果有不同的文档地址
      {
        text: "v2.x",
        items: [
          { text: "v1.x", link: "https://xxx/1" },
          { text: "v0.x", link: "https://xxx/0" },
        ],
      },
      { text: "Github", link: "https://github.com/ziyi2/micro-framework" },
    ],

    // 注意使用多个侧边栏，否则顶部导航切换的时候侧边栏一直存在
    // https://www.vuepress.cn/theme/default-theme-config.html#%E5%A4%9A%E4%B8%AA%E4%BE%A7%E8%BE%B9%E6%A0%8F
    sidebar: {
      // 跳转到开发指南的时候展示侧边栏
      "/guide/": [
        {
          title: "开发指南",
          collapsable: false,
          children: [
            "/guide/introduction",
            "/guide/install",
            "/guide/use",
            "/guide/vue",
          ],
        },
      ],

      // 注意和以下形式的区别
      //   "/guide/": ["introduction", "install", "use"],
    },
  },

  // 配置插件（需要安装依赖）
  plugins: ["vuepress-plugin-cat"],

  chainWebpack: (config) => {
    // 可以额外进行 Webpack 配置，使用 webpack-chain 进行链式操作，
    // 例如希望可以直接引入 src 目录下的源码，那么可以进行路径映射
    // 这里只用于演示，真正
    // config.resolve.alias.set("image", path.resolve(__dirname, "public"));
  },

  configureWebpack: (config, isServer) => {
    if (!isServer) {
      // 修改客户端的 webpack 配置
    }
  },
};
