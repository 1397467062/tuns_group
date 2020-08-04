import { post } from "tuns-fetch-web";

export const queryInsOne = data => {
  return post("/ins/app/group/queryInsOne", data);
};

export const queryProdInfo = data => {
  return post("/ins/app/group/queryProdInfo", data, {
    isCheck: false,
  });
};
