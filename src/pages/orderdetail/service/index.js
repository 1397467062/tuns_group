import { post } from "tuns-fetch-web";

// 查询订单详情
export const postInsureDetail = data => {
  return post("/ins/app/groupInsures/groupInsure", data);
};