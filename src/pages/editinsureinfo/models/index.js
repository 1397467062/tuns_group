import moment from "moment";
import { storage } from "tuns-utils";
import { Toast } from "antd-mobile";
import {
  loadProposalInfo,
  loadProductInfo,
  loadProductInsureInfo,
  loadProfessionData,
  premiumCaculate,
  proposalSave,
} from "../../../services";
import { ProfessionAmountRule } from "../../../insrules/professionamountrule";

const addPlan = () => {
  return {
    key: `${new Date().getTime()}`,
    professions: [
      {
        key: `${new Date().getTime()}`,
        insureds: [],
      },
    ],
    itemKinds: [],
  };
};

export const stringNumber = ["0", "1", "2", "3", "4", "5"];

const stateInit = () => {
  return {
    productInfo: {},
    productInfo2: {},
    proposalSaveInfo: {
      base: {},
      plans: [addPlan()],
      policyHolder: {},
    },
    professions: [],
    premium: 0,
    proposalNumber: null,
    premiumNumber: null,
  };
};

export default {
  namespace: "proposalSaveSpace",
  state: stateInit(),
  effects: {
    *loadProposalInfo({ payload }, { call, put }) {
      const response = yield call(loadProposalInfo, payload);
      const { base, plans, policyHolder, proposalNumber } = response;
      if (response) {
        yield put({
          type: "updateProposalSaveInfo",
          payload: { base, plans, policyHolder } || {},
        });
        yield put({
          type: "updateProposalNumber",
          payload: proposalNumber,
        });
      }
    },
    *loadProductInfo({ payload }, { call, put }) {
      const response = yield call(loadProductInfo, payload);
      yield put({ type: "updateProductInfo2", payload: response || {} });
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
      yield put({ type: "updateProductInfo", payload: response || {} });
      yield put({
        type: "updatePremiumNumber",
        payload: payload.premiumNumber,
      });
    },
    *addPlan(_, { put, select }) {
      const { proposalSaveInfo } = yield select(
        store => store.proposalSaveSpace
      );
      const { plans } = proposalSaveInfo;
      plans.push(addPlan());
      yield put({
        type: "updateProposalSaveInfo",
        payload: { ...proposalSaveInfo },
      });
    },
    *removePlan({ payload }, { put, select }) {
      const { proposalSaveInfo } = yield select(
        store => store.proposalSaveSpace
      );
      const { plans } = proposalSaveInfo;
      proposalSaveInfo.plans = plans.filter(item => item.key !== payload);
      yield put({
        type: "updateProposalSaveInfo",
        payload: { ...proposalSaveInfo },
      });
    },
    *premiumCaculate({ payload }, { put, select }) {
      const { proposalSaveInfo, productInfo } = yield select(
        store => store.proposalSaveSpace
      );
      const { plans } = proposalSaveInfo;
      const { form } = payload;
      const values = form.getFieldsValue();
      const baseTemp = {};
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          baseTemp[key] = values[key];
        }
      }
      // 重整数据
      const request = {
        base: {
          ageSupport: baseTemp.ageSupport,
          insurancePeriod:
            baseTemp.insurancePeriod && baseTemp.insurancePeriod.length > 0
              ? baseTemp.insurancePeriod[0]
              : null,
          productCode: productInfo.base.productCode,
          planId: productInfo.base.planId,
          planCode: productInfo.base.planCode,
        },
      };
      const requestPlans = [];
      request.plans = requestPlans;
      plans.forEach((planItem, index) => {
        const requestPlan = {};
        requestPlans.push(requestPlan);
        const requestItemKinds = [];
        const requestProfessions = [];
        requestPlan.planName = `保障计划${stringNumber[index + 1]}`;
        requestPlan.itemKinds = requestItemKinds;
        requestPlan.professions = requestProfessions;

        const { itemKinds, professions } = planItem;
        itemKinds.forEach(itemKindItem => {
          const requestItemKindItem = {
            liabilityCode: itemKindItem.liabilityCode,
            liabilityInsCode: itemKindItem.liabilityInsCode,
            liabilityTypeCode: itemKindItem.liabilityTypeCode,
            insuredAmount: itemKindItem.insuredAmount,
            insuredAmountText: itemKindItem.insuredAmountText,
            amountUnit: itemKindItem.amountUnit,
          };
          requestItemKinds.push(requestItemKindItem);
        });
        professions.forEach(professionItem => {
          const requestProfessionItem = {
            professionClassify: professionItem.professionClassify,
            professionCode: professionItem.professionCode,
            insuredCount: professionItem.insureds
              ? professionItem.insureds.length
              : 0,
          };
          requestProfessions.push(requestProfessionItem);
        });
      });

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
    *proposalSave({ payload }, { select }) {
      const {
        proposalSaveInfo,
        productInfo,
        premium,
        proposalNumber,
        premiumNumber,
      } = yield select(store => store.proposalSaveSpace);
      const { plan, info } = payload;
      const storageFlag = payload.storage;
      const { plans } = proposalSaveInfo;
      const baseTemp = {};
      const requestBase = {};
      const requestParameters = {};
      for (const key in plan) {
        if (!(key && key.indexOf("__") !== -1)) {
          if (Object.prototype.hasOwnProperty.call(plan, key)) {
            const value = plan[key];
            baseTemp[key] = value;
            let valueTemp;
            if (value instanceof Array && value.length === 1) {
              [valueTemp] = value;
            } else if (key === "insuranceBegin") {
              valueTemp = moment(value).format("YYYY-MM-DD HH:mm:ss");
            } else if (key === "insuranceEnd") {
              if (value && value.length) {
                valueTemp = `${value}:59`;
              } else {
                valueTemp = null;
              }
            } else if (value instanceof Array && value.length === 0) {
              valueTemp = null;
            } else {
              valueTemp = value;
            }
            requestBase[key] = valueTemp;
            requestParameters[key] = valueTemp;
          }
        }
      }
      const policyholderInfo = {};
      for (const key in info) {
        if (!(key && key.indexOf("__") !== -1)) {
          if (Object.prototype.hasOwnProperty.call(info, key)) {
            const value = info[key];
            policyholderInfo[key] = value;
            let valueTemp;
            if (
              value instanceof Array &&
              value.length === 1 &&
              key !== "identityImages" &&
              key !== "identificationUrl"
            ) {
              [valueTemp] = value;
            } else if (value instanceof Array && value.length === 0) {
              valueTemp = null;
            } else {
              valueTemp = value;
            }
            policyholderInfo[key] = valueTemp;
            requestParameters[key] = valueTemp;
          }
        }
      }
      requestBase.productCode = productInfo.base.productCode;
      requestBase.planCode = productInfo.base.planCode;
      requestBase.planId = productInfo.base.planId;
      requestBase.premium = premium;
      // 重整数据
      const request = {
        proposalNumber,
        premiumNumber,
        storage: storageFlag,
        base: requestBase,
        parameters: requestParameters,
      };
      const requestPlans = [];
      request.plans = requestPlans;
      plans.forEach((planItem, index) => {
        const requestPlan = {
          planName: `保障计划${stringNumber[index + 1]}`,
        };
        requestPlans.push(requestPlan);
        const requestItemKinds = [];
        const requestProfessions = [];
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
        professions.forEach(professionItem => {
          const { insureds } = professionItem;
          const requestProfessionItem = {
            professionId: professionItem.professionId,
            professionClassify: professionItem.professionClassify,
            professionCode: professionItem.professionCode,
            professionName: professionItem.professionName,
            insuredCount: insureds.length,
          };
          const requestInsureds = [];
          requestProfessionItem.insureds = requestInsureds;
          insureds.forEach(insuredItem => {
            const insuredItemIdentityType = insuredItem.identityType;
            const requestInsured = {
              name: insuredItem.name,
              identityType:
                typeof insuredItemIdentityType === "object"
                  ? insuredItemIdentityType &&
                    insuredItemIdentityType.length > 0
                    ? insuredItemIdentityType[0]
                    : null
                  : insuredItemIdentityType,
              identityNumber: insuredItem.identityNumber,
              sex:
                insuredItem.sex && insuredItem.sex.length > 0
                  ? insuredItem.sex[0]
                  : null,
              birth: moment(insuredItem.birth).format("YYYY-MM-DD"),
            };
            requestInsureds.push(requestInsured);
          });
          requestProfessions.push(requestProfessionItem);
        });
      });
      const requestPolicyHolder = {
        companyName: policyholderInfo.companyName,
        industries: policyholderInfo.industries,
        enterpriseNature: policyholderInfo.enterpriseNature,
        identityType: policyholderInfo.identityType,
        identityNumber: policyholderInfo.identityNumber,
        companyAddress: policyholderInfo.companyAddress,
        contactName: policyholderInfo.contactName,
        contactPhone: policyholderInfo.contactPhone,
        contactAddress: policyholderInfo.contactAddress,
        contactEmail: policyholderInfo.contactEmail,
        securityCode: policyholderInfo.securityCode,
        ...policyholderInfo,
      };
      request.policyHolder = requestPolicyHolder;
      const requestInvoice = {
        invoiceType: policyholderInfo.invoiceType,
        invoiceTitle: policyholderInfo.invoiceTitle,
        identityNumber: policyholderInfo.invoiceIdentityNumber,
        invoiceEmail: policyholderInfo.invoiceEmail,
      };
      const identityImages = policyholderInfo.identityImages || [];
      const requestIdentityImages = [];
      identityImages.forEach(identityImageItem => {
        const requestIdentityImage = {
          imageName: identityImageItem.fileName,
          key: identityImageItem.key,
        };
        requestIdentityImages.push(requestIdentityImage);
      });
      requestPolicyHolder.identityImages = requestIdentityImages;
      requestPolicyHolder.identificationUrl = JSON.stringify(
        requestIdentityImages
      );
      requestParameters.identityImages = null;
      requestParameters.identificationUrl =
        requestPolicyHolder.identificationUrl;
      request.invoice = requestInvoice;
      request.salesman = { code: storage.get("salesmanid") || "" };
      Toast.loading(storageFlag === "1" ? "正在暂存" : "正在投保", 60);
      const response = yield proposalSave(request);
      if (response) {
        Toast.hide();
      }
      return response;
    },
  },
  reducers: {
    clearState: () => stateInit(),
    updateProductInfo: (state, { payload }) => ({
      ...state,
      productInfo: payload,
    }),
    updateProductInfo2: (state, { payload }) => ({
      ...state,
      productInfo2: payload,
    }),
    updateProposalSaveInfo: (state, { payload }) => ({
      ...state,
      proposalSaveInfo: payload,
    }),
    updateProfessions: (state, { payload }) => ({
      ...state,
      professions: payload,
    }),
    updatePremium: (state, { payload }) => ({
      ...state,
      premium: payload,
    }),
    updateProposalNumber: (state, { payload }) => ({
      ...state,
      proposalNumber: payload,
    }),
    updatePremiumNumber: (state, { payload }) => ({
      ...state,
      premiumNumber: payload,
    }),
  },
};
