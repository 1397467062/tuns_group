import { Toast } from "antd-mobile";
import { getQueryIns } from "../service";


const initState = {
  insList: [],
};

export default {
  namespace: "instypes",
  state: {
    ...initState,
  },
  effects: {
    *getProducts(_, { call, put }) {
      const res = yield call(getQueryIns, {});
      const { data = [], response = {} } = res;
      if (response.head && response.head.messageCd !== "0000") {
        return Toast.info(response.head.messageInf)
      }
      yield put({
        type: "saveinsList",
        payload: data,
      });
    },
  },
  reducers: {
    saveinsList: (state, { payload }) => ({
      ...state,
      insList: payload,
    }),
  },
};