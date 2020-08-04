import { post, get } from "tuns-fetch-web";

// 查询订单详情
export const groupInsure = data => {
  return post("/ins/app/groupInsures/groupInsure", data);
};

// 确认订单
export const confirmInsure = data => {
  return post("/ins/app/groupInsures/confirmInsure", data);
};

// 支付申请
export const paymentApply = data => {
  return get("/ins/app/common/paymentApply", data);
};
