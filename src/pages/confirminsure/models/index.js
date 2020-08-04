import { groupInsure, confirmInsure, paymentApply } from "../service";

const initState = {
  data: {},
};

export default {
  namespace: "confirm",
  state: {
    ...initState,
  },
  effects: {
    *groupInsure({ payload }, { call, put }) {
      const res = yield call(groupInsure, payload);
      const { data = {} } = res;
      yield put({
        type: "saveDatas",
        payload: data,
      });
    },
    *confirmInsure({ payload }, { call }) {
      const res = yield call(confirmInsure, payload);
      return res;
    },
    *paymentApply({ payload }, { call }) {
      const res = yield call(paymentApply, payload);
      return res.data;
    },
  },
  reducers: {
    saveDatas: (state, { payload }) => ({
      ...state,
      data: payload,
    }),
  },
};
