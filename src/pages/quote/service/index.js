import { post } from "tuns-fetch-web";


// 查询询价报价配置
export const postQuoteConfig = data => {
  return post("/ins/app/oneOffer/queryOfferConfig", data);
};
// 查询询价保障项
export const postSafeguards = data => {
  return post("/ins/app/oneOffer/querySafeguards", data);
};
// 询价保存
export const postSaveEnquiry = data => {
  return post("/ins/app/oneOffer/saveEnquiry", data);
};
// 用户信息
export const getUserInfo = data => {
  return post("/ins/app/cmm/getUserProfile", data);
};

