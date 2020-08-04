import { post } from "tuns-fetch-web";

// 查询符合报价公司
export const postInsCompany = data => {
  return post("/ins/app/oneOffer/queryInsuranceCompany", data);
};