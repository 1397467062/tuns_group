import { post } from "tuns-fetch-web";

// 询价预约报价
export const postOrderOffer = data => {
  return post("/ins/app/oneOffer/orderOffer", data);
};

// 查询报价结果
export const postQuotResult = data => {
  return post("/ins/app/oneOffer/quotationResult", data);
};

// 查询报价投保保费合计
export const postCostTotal = data => {
  return post("/ins/app/oneOffer/insCostTotal", data);
};
