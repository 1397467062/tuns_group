import { helpMeRecord } from "../service";

export default {
  namespace: "record",
  state: {},
  effects: {
    *helpMeRecord({ payload }, { call }) {
      const res = yield call(helpMeRecord, payload);
      return res;
    },
  },
};
