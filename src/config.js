import { storage } from "tuns-utils";
import { Toast } from "antd-mobile";
import { containerAction } from "./utils";

const authErrorCode = ["P0018", "P0019", "P0020"];

const checkSystem = () => {
  const u = window.navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
};

const checkSystemSafeArea = () => {
  return window.navigator.userAgent.indexOf("SafeArea/true") >= 0;
};

const TUNS_GLOBAL = {
  SystemNavTop: 0,
  SystemNavSafeAreaTop: 0,
  SystemTuns: false,
};

const userAgentStr = window.navigator.userAgent;
TUNS_GLOBAL.SystemTuns = userAgentStr.indexOf(" Tuns/") > -1;

// 菜单高度
if (checkSystem() && TUNS_GLOBAL.SystemTuns) {
  TUNS_GLOBAL.SystemNavTop = 40;
}

// 安全区域（刘海屏）
if (checkSystemSafeArea()) {
  TUNS_GLOBAL.SystemNavSafeAreaTop = 48;
}

TUNS_GLOBAL.SystemNavPaddingTop =
  TUNS_GLOBAL.SystemNavTop + TUNS_GLOBAL.SystemNavSafeAreaTop;

window.TUNS_GLOBAL = TUNS_GLOBAL;

export default {
  requestOptions: {
    timeout: 60000,
  },
  trimReqData: (body = {}) => {
    const { _history } = window.g_app;
    const { location } = _history;
    const { query } = location;
    const { shareId } = query;
    body.shareId = shareId;
    return {
      head: {
        version: "0.0.1",
        requestId: "123123123",
        system: "1",
        deviceId: "unknown",
        tokenId: storage.get("token"),
      },
      body,
    };
  },
  trimResData: res => {
    const { head } = res.data;
    if (
      head.messageCd !== "0000" &&
      authErrorCode.some(item => item === head.messageCd)
    ) {
      containerAction("LoginInvalid", "{}");
    }
    return res.data.body;
  },
  requestError: () => {
    Toast.fail("网络请求超时，请稍稍再试");
    return {};
  },
};
