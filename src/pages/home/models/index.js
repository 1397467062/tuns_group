import { Toast } from "antd-mobile";
import { queryProdInfo, queryInsOne } from "../service";
import { filterTabs, filterProdList } from "../service/filter";

const initState = {
  prodList: [],
  totalNum: 0,
  tabs: [{ title: "" }],
};

export default {
  namespace: "home",
  state: {
    ...initState,
  },
  effects: {
    *queryProdInfo({ payload, clear }, { call, put }) {
      const res = yield call(queryProdInfo, payload);
      if (!res) {
        Toast.fail("暂无数据");
        return;
      }
      const { resultData = [], totalNum = 0 } = res.data || {};
      yield put({
        type: "saveProList",
        payload: {
          list: filterProdList(resultData),
          totalNum,
        },
        clear,
      });
    },
    *queryInsOne(_, { call, put }) {
      const res = yield call(queryInsOne);
      yield put({
        type: "saveTab",
        payload: filterTabs(res.data || []),
      });
    },
  },
  reducers: {
    saveProList: (state, { payload, clear }) => ({
      ...state,
      prodList: clear ? payload.list : [...state.prodList, ...payload.list],
      totalNum: payload.totalNum,
    }),
    saveTab: (state, { payload }) => ({
      ...state,
      tabs: payload,
    }),
    clear: () => ({ ...initState }),
  },
};
