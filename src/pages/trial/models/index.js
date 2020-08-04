import { Toast } from "antd-mobile";
import { storage } from "tuns-utils";
import {
  loadProductInfo,
  loadProfessionData,
  premiumCaculate,
  share,
} from "../../../services";
import { ProfessionAmountRule } from "../../../insrules/professionamountrule";

const addPlan = () => {
  return {
    key: `${new Date().getTime()}`,
    professions: [
      {
        key: `${new Date().getTime()}`,
        insuredCount: 1,
      },
    ],
    itemKinds: [],
  };
};

export const stringNumber = ["0", "1", "2", "3", "4", "5"];

const stateInit = () => {
  return {
    productInfo: {},
    proposalTrialInfo: {
      base: {},
      plans: [addPlan()],
    },
    professions: [],
    premium: 0,
  };
};

export default {
  namespace: "proposalTrialSpace",
  state: stateInit(),
  effects: {
    *loadProductInfo({ payload }, { call, put }) {
      const response = yield call(loadProductInfo, payload);
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
      yield put({ type: "updateProductInfo", payload: response || {} });
    },
    *addPlan(_, { put, select }) {
      const { proposalTrialInfo } = yield select(
        store => store.proposalTrialSpace
      );
      const { plans } = proposalTrialInfo;
      plans.push(addPlan());
      yield put({
        type: "updateProposalTrialInfo",
        payload: { ...proposalTrialInfo },
      });
    },
    *removePlan({ payload }, { put, select }) {
      const { proposalTrialInfo } = yield select(
        store => store.proposalTrialSpace
      );
      const { plans } = proposalTrialInfo;
      proposalTrialInfo.plans = plans.filter(item => item.key !== payload);
      yield put({
        type: "updateProposalTrialInfo",
        payload: { ...proposalTrialInfo },
      });
    },
    *premiumCaculate({ payload }, { put, select }) {
      const { proposalTrialInfo, productInfo } = yield select(
        store => store.proposalTrialSpace
      );
      const { base, plans } = proposalTrialInfo;
      const { form } = payload;
      const storageFlag = payload.storage;
      if (storageFlag === "1") {
        let pass = true;
        form.validateFields((error, values) => {
          if (error) {
            pass = false;
            const key = Object.keys(error)[0];
            const { errors } = error[key];
            const { message } = errors[0];
            Toast.fail(message, 2);
          } else {
            for (const key in values) {
              if (Object.prototype.hasOwnProperty.call(values, key)) {
                const value = base[key];
                let valueTemp;
                if (value instanceof Array && value.length === 1) {
                  [valueTemp] = value;
                } else if (value instanceof Array && value.length === 0) {
                  valueTemp = null;
                } else {
                  valueTemp = value;
                }
                base[key] = valueTemp;
              }
            }
          }
        });
        if (!pass) return;
      }
      const values = form.getFieldsValue();
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          base[key] = values[key];
        }
      }
      const requestParameters = {};
      for (const key in base) {
        if (!(key && key.indexOf("__") !== -1)) {
          if (Object.prototype.hasOwnProperty.call(base, key)) {
            const value = base[key];
            let valueTemp;
            if (value instanceof Array && value.length === 1) {
              [valueTemp] = value;
            } else if (value instanceof Array && value.length === 0) {
              valueTemp = null;
            } else {
              valueTemp = value;
            }
            base[key] = valueTemp;
            requestParameters[key] = valueTemp;
          }
        }
      }
      // 重整数据
      const request = {
        base: {
          storage: storageFlag,
          insurancePeriod: base.noncar_insurance_time_limit,
          productCode: productInfo.base.productCode,
          planId: productInfo.base.planId,
          planCode: productInfo.base.planCode,
        },
        parameters: requestParameters,
      };
      const requestPlans = [];
      request.plans = requestPlans;
      plans.forEach((planItem, planIndex) => {
        const requestPlan = {
          key: `plan_${planIndex}`,
        };
        requestPlans.push(requestPlan);
        const requestItemKinds = [];
        const requestProfessions = [];
        requestPlan.planName = `保障计划${stringNumber[planIndex + 1]}`;
        requestPlan.itemKinds = requestItemKinds;
        requestPlan.professions = requestProfessions;

        const { itemKinds, professions } = planItem;
        itemKinds.forEach(itemKindItem => {
          const requestItemKindItem = {
            liabilityCode: itemKindItem.liabilityCode,
            liabilityInsCode: itemKindItem.liabilityInsCode,
            liabilityTypeCode: itemKindItem.liabilityTypeCode,
            liabilityName: itemKindItem.liabilityName,
            liabilityAbstract: itemKindItem.liabilityAbstract,
            liabilityDescribe: itemKindItem.liabilityDescribe,
            insuredAmount: itemKindItem.insuredAmount,
            insuredAmountText: itemKindItem.insuredAmountText,
            amountUnit: itemKindItem.amountUnit,
          };
          requestItemKinds.push(requestItemKindItem);
        });
        professions.forEach((professionItem, professionIndex) => {
          const requestProfessionItem = {
            key: `profession_${professionIndex}`,
            professionClassify: professionItem.professionClassify,
            professionCode: professionItem.professionCode,
            professionName: professionItem.professionName,
            insuredCount: professionItem.insuredCount,
          };
          requestProfessions.push(requestProfessionItem);
        });
      });
      if (storageFlag === "2") {
        storage.set("K_PROPOSAL_INFO", JSON.stringify(request));
        return null;
      }
      // 验数据
      const professionSupport = productInfo.base.professionSupport || [];
      const itemKindsSupport = productInfo.itemKinds;
      const itemKindsSupportTemp = [];
      itemKindsSupport.forEach(item => {
        itemKindsSupportTemp.push(item);
        const subItemKinds = item.itemKinds;
        if (subItemKinds) {
          subItemKinds.forEach(subItem => {
            itemKindsSupportTemp.push(subItem);
          });
        }
      });
      for (let i = 0, { length } = plans; i < length; i += 1) {
        const plan = plans[i];
        const { message } = ProfessionAmountRule(
          plan,
          itemKindsSupportTemp,
          professionSupport
        );
        if (message) {
          Toast.fail(`保障计划${stringNumber[i + 1]}中${message}`);
          return;
        }
      }

      const response = yield premiumCaculate(request);
      const responseBase = response.base || {};
      yield put({
        type: "updatePremium",
        payload: responseBase.premium || 0,
      });
      return responseBase;
    },
    *share({ payload }, { call }) {
      const res = yield call(share, payload);
      return res;
    },
  },
  reducers: {
    clearState: () => stateInit(),
    updateProposalTrialInfo: (state, { payload }) => ({
      ...state,
      proposalTrialInfo: payload,
    }),
    updateProductInfo: (state, { payload }) => ({
      ...state,
      productInfo: payload,
    }),
    updateProfessions: (state, { payload }) => ({
      ...state,
      professions: payload,
    }),
    updatePremium: (state, { payload }) => ({
      ...state,
      premium: payload,
    }),
  },
};
