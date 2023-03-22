import ip from "ip";

export default {
  port: {
    main: 4000,
    micro: 3000,
  },
  // 获取本机的 IP 地址
  host: ip.address(),
};
