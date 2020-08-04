import { Toast } from "antd-mobile";
import { postOrderOffer, postQuotResult, postCostTotal } from "../service";
import { share } from "../../../services";

import { datas, dataToModel } from "../service/filter";

const initState = {
  columns: [],
  datas: [],
  totalnum: 0,
  costTotal: [],
  premAmounts: {},
  opendatas: [],
};

export default {
  namespace: "quoteresult",
  state: {
    ...initState,
  },
  effects: {
    *getAppoint({ payload }, { call }) {
      const res = yield call(postOrderOffer, payload);
      const { response = {} } = res;
      return response.head;
    },
    *getCostTotal({ payload }, { call, put }) {
      const res = yield call(postCostTotal, payload);
      const { response = {}, data = {} } = res;
      const { messageCd, messageInf = "" } = response.head;
      if (messageCd === "0000") {
        const { giGroupInsCostTotalDTOList } = data;
        yield put({
          type: "saveCostTotal",
          payload: giGroupInsCostTotalDTOList,
        });
      } else {
        Toast.info(messageInf);
      }
    },

    *getResult({ payload }, { call, put }) {
      const res = yield call(postQuotResult, payload);
      const { response = {}, data } = res;
      const { messageCd, messageInf = "" } = response.head;
      if (messageCd === "0000") {
        const { columns, occupation } = dataToModel(data);
        yield put({
          type: "saveData",
          payload: { columns, datas: datas(occupation) },
        });
      } else {
        Toast.info(messageInf);
      }
    },

    *getShare({ payload }, { call }) {
      const res = yield call(share, payload);
      return res;
    },
  },
  reducers: {
    saveData: (state, { payload }) => ({
      ...state,
      columns: payload.columns,
      datas: payload.datas.data,
      totalnum: payload.datas.totalnum,
      premAmounts: payload.datas.premAmounts,
      opendatas: payload.datas.opendata,
    }),
    saveCostTotal: (state, { payload }) => ({
      ...state,
      costTotal: payload,
    }),
  },
};
