import { router } from "yeo-router";

/**
 * 从字符串获取参数&分割
 *
 * @param {string} string 链接参数字符串
 * @returns {{}} 链接上的参数
 */
const paramsFromString = string => {
  const result = {};
  if (!string || string.length === 0) {
    return result;
  }
  const strings = string.split("&");
  for (let i = 0; i < strings.length; i += 1) {
    const keyValue = strings[i].split("=");
    result[keyValue[0]] = decodeURIComponent(keyValue[1]);
  }
  return result;
};

export class TSRouter {
  static push(p) {
    let paramsTemp;
    let queryTemp;
    let pTemp = p;
    if (typeof pTemp === "string") {
      const index = pTemp.indexOf("?");
      if (index !== -1) {
        queryTemp = paramsFromString(pTemp.substr(index + 1));
        pTemp = pTemp.substr(0, index);
      }
      paramsTemp = { pathname: pTemp, query: queryTemp };
    } else {
      queryTemp = pTemp.query || {};
      pTemp.query = queryTemp;
      paramsTemp = pTemp;
    }
    const { _history } = window.g_app;
    const { location } = _history;
    const { query } = location;
    const { shareId } = query;
    if (shareId) {
      queryTemp.shareId = shareId;
    }
    router.push(paramsTemp);
  }

  static go(params) {
    router.go(params);
  }
}
