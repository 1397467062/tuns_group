import { Toast, Modal } from "antd-mobile";
import { postUnquoteConfig, postSaveUnquote } from "../service";

const initState = {
  configs: [],
};

export default {
  namespace: "unquote",
  state: {
    ...initState,
  },
  effects: {
    *getconfig({ payload }, { call, put }) {
      const res = yield call(postUnquoteConfig, payload);
      const { data = [] } = res;
      yield put({
        type: "saveConfig",
        payload: data,
      });
    },
    *saveUnquote({ payload }, { call }) {
      const res = yield call(postSaveUnquote, payload);
      const { response } = res;
      const { messageCd, messageInf = "" } = response.head
      if (messageCd === "0000") {
        Modal.alert('询价申请已成功提交！', '', [
          { text: '确认', onPress: () => { }, style: { fontSize: "0.28rem", fontFamily: "PingFangSC-Regular", color: "#FB7037" } },
        ])
      } else {
        Toast.info(messageInf)
      }
    },
  },
  reducers: {
    saveConfig: (state, { payload }) => ({
      ...state,
      configs: payload,
    }),
  },
};