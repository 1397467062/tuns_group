import { Toast } from "antd-mobile";
import { postQuoteConfig, postSafeguards, postSaveEnquiry, getUserInfo } from "../service";

import {
  mergedata,
} from "../service/filter";

const initState = {
  configs: [],
  premdata: {},
  username: null,
};

export default {
  namespace: "quote",
  state: {
    ...initState,
  },
  effects: {
    *getconfig({ payload }, { call, put }) {
      const res = yield call(postQuoteConfig, payload);
      const safeRes = yield call(postSafeguards, payload);
      const { data, premdata } = mergedata(res, safeRes)

      yield put({
        type: "saveConfig",
        payload: { data, premdata },
      });
    },
    *saveQuote({ payload }, { call }) {
      const res = yield call(postSaveEnquiry, payload);
      const { response = {}, data } = res
      const { messageCd, messageInf = "" } = response.head
      if (messageCd === "0000") {
        // 成功
        return data
      } else {
        Toast.info(messageInf)
      }


    },
    *saveUserInfo({ payload, callback }, { call }) {
      const res = yield call(getUserInfo, payload);
      const { response = {}, data } = res
      const { messageCd, messageInf = "" } = response.head
      if (messageCd === "0000") {
        if (callback) callback(data)
      } else {
        Toast.info(messageInf)
      }


    },
  },
  reducers: {
    saveConfig: (state, { payload }) => ({
      ...state,
      configs: payload.data,
      premdata: payload.premdata,
    }),
  },
};