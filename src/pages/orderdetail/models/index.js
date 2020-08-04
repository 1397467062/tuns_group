import { postInsureDetail } from "../service";
import { share } from "../../../services";

const initState = {
  data: {},
};

export default {
  namespace: "orderdetail",
  state: {
    ...initState,
  },
  effects: {
    *getDetailData({ payload }, { call, put }) {
      const res = yield call(postInsureDetail, payload);
      const { data = {} } = res;
      yield put({
        type: "saveDatas",
        payload: data,
      });
    },
    *shareDetail({ payload }, { call }) {
      const res = yield call(share, payload);
      return res;
    },
  },
  reducers: {
    saveDatas: (state, { payload }) => ({
      ...state,
      data: payload,
    }),
  },
};
