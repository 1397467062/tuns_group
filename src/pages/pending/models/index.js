import { queryProdInfo, deleteInfo } from "../service";

const initState = {
  prodList: [],
  totalNum: 0,
};

export default {
  namespace: "pending",
  state: {
    ...initState,
  },
  effects: {
    *queryProdInfo({ payload, clear }, { call, put }) {
      const res = yield call(queryProdInfo, payload);
      const { data = {} } = res;
      const { resultData = [], totalNum = 0 } = data;
      yield put({
        type: "saveProList",
        payload: {
          list: resultData,
          totalNum,
        },
        clear,
      });
    },
    *deleteInfo({ payload }, { call }) {
      const res = yield call(deleteInfo, payload);
      return res;
    },
  },
  reducers: {
    saveProList: (state, { payload, clear }) => ({
      ...state,
      prodList: clear ? payload.list : [...state.prodList, ...payload.list],
      totalNum: payload.totalNum,
    }),
    clear: () => ({ ...initState }),
  },
};
