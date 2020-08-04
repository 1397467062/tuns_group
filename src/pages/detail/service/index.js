import { post, get } from "tuns-fetch-web";
import { getRunEnv } from "../../../utils";

export const insGroupDetails = data =>
  post("/ins/app/oneOffer/insGroupDetails", data);
// 职业类别
export const loadProfessionData = data =>
  get(
    `${
      getRunEnv() === "pro" ? "https://" : "http://test."
    }file.tuns.com.cn/tuns/library/profession/GI_${data}.json`,
    {},
    {
      isCheck: false,
    }
  );
// 计算保费
export const compareAmount = data =>
  post("/ins/app/groupInsures/compareAmount", data);
