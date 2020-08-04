import { Toast } from "antd-mobile";
import { postInsCompany } from "../service";

const initState = {
  inscompanys: [],
};

export default {
  namespace: "inscompanys",
  state: {
    ...initState,
  },
  effects: {
    *getCompany({ payload }, { call, put }) {
      const res = yield call(postInsCompany, payload);

      const { response = {}, data = {} } = res
      const { messageCd, messageInf = "" } = response.head
      const { giOfferInsCompanyDTOList = [] } = data

      if (messageCd === "0000") {
        yield put({
          type: "saveCompanys",
          payload: giOfferInsCompanyDTOList || [],
        });
        return data

        // 成功
      } else {
        Toast.info(messageInf)
      }

    },
  },
  reducers: {
    saveCompanys: (state, { payload }) => ({
      ...state,
      inscompanys: payload,
    }),
  },
};