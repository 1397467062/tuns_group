import { Toast } from "antd-mobile";
import { getOrders } from "../service";
import { trimOrdersData } from "../service/filter";

const initState = {
  orderList: [],
  totalNum: 0,
  isEnd: false,
};

export default {
  namespace: "order",
  state: {
    ...initState,
  },
  effects: {
    *getOrders({ payload, clear }, { call, put }) {
      const res = yield call(getOrders, payload);
      if (!res.data) {
        Toast.fail(res.response.head.messageInf);
        return;
      }
      const { resultData = [], totalNum = 0 } = res.data;
      yield put({
        type: "saveOrders",
        payload: {
          list: trimOrdersData(resultData),
          totalNum,
        },
        clear,
      });
      yield put({
        type: "saveEnd",
        payload: true,
      });
    },
  },
  reducers: {
    saveOrders: (state, { payload, clear }) => ({
      ...state,
      orderList: clear ? payload.list : [...state.orderList, ...payload.list],
      totalNum: payload.totalNum,
    }),
    saveEnd: (state, { payload }) => ({
      ...state,
      isEnd: payload,
    }),
    clear: () => ({ ...initState }),
  },
};
