import { post } from "tuns-fetch-web";

export const queryProdInfo = data => {
  return post("/ins/app/groupInsures/groupInsureResults", data);
};
// 删除订单
export const deleteInfo = data => {
  return post("/ins/app/groupInsures/modifyInsure", data);
};
