import {
  loadProductInfo,
  loadProductInsureInfo,
  loadProfessionData,
  premiumCaculateInfo,
} from "../../../services";

export default {
  namespace: "premiumTrialDetailSpace",
  state: {
    premiumTrialDetail: {},
    productInfo: {},
    productInsureInfo: {},
    professions: [],
  },
  effects: {
    *premiumTrialDetail({ payload }, { call, put }) {
      const response = yield call(premiumCaculateInfo, payload);
      yield put({ type: "updatePremiumTrialDetail", payload: response || {} });
    },
    *loadProductInfo({ payload }, { call, put }) {
      const response = yield call(loadProductInfo, payload);
      if (response) {
        const base = response.base || {};
        document.title = base.productName;
      }
      yield put({ type: "updateProductInfo", payload: response || {} });
      return response;
    },
    *loadProductInsureInfo({ payload }, { call, put }) {
      const response = yield call(loadProductInsureInfo, payload);
      let professions;
      try {
        professions = yield call(
          loadProfessionData,
          `${response.insuranceCarriersCode}`
        );
      } catch (e) {
        professions = [];
      }
      yield put({ type: "updateProfessions", payload: professions || [] });
      yield put({ type: "updateProductInsureInfo", payload: response || {} });
    },
  },
  reducers: {
    updatePremiumTrialDetail: (state, { payload }) => ({
      ...state,
      premiumTrialDetail: payload,
    }),
    updateProductInfo: (state, { payload }) => ({
      ...state,
      productInfo: payload,
    }),
    updateProductInsureInfo: (state, { payload }) => ({
      ...state,
      productInsureInfo: payload,
    }),
    updateProfessions: (state, { payload }) => ({
      ...state,
      professions: payload,
    }),
  },
};
