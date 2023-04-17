// config.js
// https://github.com/indutny/node-ip
import ip from 'ip';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  port: {
    main: 4000,
    micro: 3000,
  },

  // 获取本机的 IP 地址
  host: ip.address(),

  __dirname
};
