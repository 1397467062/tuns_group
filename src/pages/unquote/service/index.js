import { post } from "tuns-fetch-web";

// 查询报价配置
export const postUnquoteConfig = data => {
  return post("/ins/app/group/queryQupteConf", data);
};
// 保存询价信息
export const postSaveUnquote = data => {
  return post("/ins/app/group/saveQupteConf", data);
};