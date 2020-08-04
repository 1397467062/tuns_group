export default {
  publicPath: "/mobile/group/",
  base: "mobile/group",
  pluginReactOption: {
    hd: true,
  },
  hash: true,
  proxy: {
    "/ins/app": {
      // http://192.168.2.20:8012 测试环境
      target: "http://192.168.2.20:8012",
      changeOrigin: true,
      secure: false,
    },
  },
};
