import { getOrders } from "../service";
import { trimOrdersData } from "../service/filter";

const initState = {
  orderList: [],
  totalNum: 0,
};

export default {
  namespace: "price",
  state: {
    ...initState,
  },
  effects: {
    *getOrders({ payload, clear }, { call, put }) {
      const res = yield call(getOrders, payload);
      const { resultData = [], totalNum = 0 } = res.data;
      yield put({
        type: "saveOrders",
        payload: {
          list: trimOrdersData(resultData),
          totalNum,
        },
        clear,
      });
    },
  },
  reducers: {
    saveOrders: (state, { payload, clear }) => ({
      ...state,
      orderList: clear ? payload.list : [...state.orderList, ...payload.list],
      totalNum: payload.totalNum,
    }),
    clear: () => ({ ...initState }),
  },
};
