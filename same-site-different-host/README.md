# 同站 & 跨域 & 父子域

启动应用

``` bash
node main-ngrok-server.js
# 新开终端启动
node micro-server.js
```

应用启动后获取 xxx.ngrok.io 中的 xxx（subdomain），配置 iHosts：

``` bash
# 示例
192.168.31.168 ziyi.8d68-115-220-251-169.ngrok.io
```

> 温馨提示：如果想要固定 ngrok 的二级域名，需要额外付费，这里在应用启动后如果二级域名发生了变化，需要实时更改 iHosts 中的配置。