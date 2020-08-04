import { Toast } from "antd-mobile";
import { storage } from "tuns-utils";
import { insGroupDetails, loadProfessionData, compareAmount } from "../service";
import {
  filterTabs,
  filterCondeType,
  filterImages,
  filterProfessionData,
  filterProj,
  filterLiab,
  filterGroupLiab,
  filterPremium,
  ProfessionAmountRule,
} from "../service/filter";
import { share } from "../../../services";

const initState = {
  detailInfo: {},
  tabs: {},
  condeType: [],
  images: [],
  profession: {},
  liab: [],
  groupLiab: [],
  profAmountLiab: [],
  project: {},
  checkedProject: {},
  premium: 0,
  formInfo: {},
  isEnd: false,
  checkedProf: null,
};

export default {
  namespace: "detail",
  state: {
    ...initState,
  },
  effects: {
    *saveFormInfo({ payload }, { select }) {
      const { checkedProf, detailInfo } = yield select(store => store.detail);
      const _checkedProf = checkedProf || {};
      const { liabValues, planValues } = payload;
      // 保存数据到本地缓存
      const { noncar_insurance_time_limit: insurancePeriod } = planValues;
      const {
        classify: professionClassify,
        name: professionName,
        id: professionId,
      } = _checkedProf;
      const itemKinds = [];
      // 转换责任
      const itemKindsSupportDic = {};
      const giGroupPlanDTOList = detailInfo.giGroupPlanDTOList || [];
      const giGroupPlanDTO =
        giGroupPlanDTOList.length > 0 ? giGroupPlanDTOList[0] : {};
      const giGroupPlanLiabDTOList =
        giGroupPlanDTO.giGroupPlanLiabDTOList || [];
      giGroupPlanLiabDTOList.forEach(giGroupPlanLiabDTO => {
        // 创建一个新的 保险责任
        const itemKind = {
          liabilityCode: giGroupPlanLiabDTO.liabId,
          liabilityInsCode: giGroupPlanLiabDTO.liabBusiCode,
          liabilityTypeCode:
            giGroupPlanLiabDTO.riskLiabTypeId || giGroupPlanLiabDTO.riskId,
          liabilityName: giGroupPlanLiabDTO.showName,
          liabilityDescribe: giGroupPlanLiabDTO.riskLiabDetail,
          liabilityAbstract:
            giGroupPlanLiabDTO.riskLiabTypeName || giGroupPlanLiabDTO.riskName,
        };
        // 创建一个新的 保险金额列表
        const insuredAmounts = [];
        if (giGroupPlanLiabDTO.premType === "1") {
          const premAmountList = giGroupPlanLiabDTO.premAmountList || [];
          premAmountList.forEach(premAmount => {
            // 创建一个新的 保险金额
            const insuredAmount = {
              insuredAmount: premAmount.premAmount,
              insuredAmountText: premAmount.premDesc,
              amountUnit: premAmount.premUnit,
              professionClassifySupport: premAmount.jobType,
            };
            insuredAmounts.push(insuredAmount);
          });
        } else {
          insuredAmounts.push({
            insuredAmount: giGroupPlanLiabDTO.premAmount,
            insuredAmountText: giGroupPlanLiabDTO.premDesc,
            amountUnit: giGroupPlanLiabDTO.premUnit,
          });
        }
        itemKind.insuredAmounts = insuredAmounts;
        itemKindsSupportDic[itemKind.liabilityInsCode] = itemKind;
      });
      for (const liabilityInsCode in liabValues) {
        if (
          Object.prototype.hasOwnProperty.call(liabValues, liabilityInsCode)
        ) {
          const liabilityInfo = liabValues[liabilityInsCode];
          const {
            liabId: liabilityCode,
            amount: insuredAmountText,
          } = liabilityInfo;
          // 获取其它信息
          const itemKindsSupport = itemKindsSupportDic[liabilityInsCode];
          const {
            liabilityTypeCode,
            liabilityName,
            liabilityAbstract,
            liabilityDescribe,
            insuredAmounts,
          } = itemKindsSupport;
          const itemKind = {
            liabilityCode,
            liabilityTypeCode,
            liabilityName,
            liabilityAbstract,
            liabilityDescribe,
            insuredAmount: null,
            insuredAmountText,
            amountUnit: null,
          };
          itemKinds.push(itemKind);
          // 找保额
          for (let i = 0, { length } = insuredAmounts; i < length; i += 1) {
            const insuredAmountInfo = insuredAmounts[i];
            if (insuredAmountInfo.insuredAmountText === insuredAmountText) {
              const { insuredAmount, amountUnit } = insuredAmountInfo;
              itemKind.insuredAmount = insuredAmount;
              itemKind.amountUnit = amountUnit;
              break;
            }
          }
        }
      }
      const _insurancePeriod =
        insurancePeriod && insurancePeriod.length > 0
          ? insurancePeriod[0]
          : null;
      const formInfo = {
        base: {
          noncar_insurance_time_limit: _insurancePeriod,
          insurancePeriod: _insurancePeriod,
        },
        policyHolder: {},
        plans: [
          {
            key: "plan_0",
            planName: "保障计划1",
            professions: [
              {
                key: "profession_0",
                professionId,
                professionClassify,
                professionCode: professionId,
                professionName,
                insuredCount: 0,
                insureds: [],
              },
            ],
            itemKinds,
          },
        ],
      };
      storage.set("K_PROPOSAL_INFO", JSON.stringify(formInfo));
    },
    *insGroupDetails({ payload }, { call, put }) {
      const res = yield call(insGroupDetails, payload);
      const { data, response } = res;
      if (!data) {
        Toast.fail(response.head.messageInf || "未查询到产品");
        return;
      }
      const {
        companyCd,
        giGroupAttachDTOList,
        giGroupCondDTOList,
        giGroupPlanDTOList,
        guaranteeFlag,
      } = data;
      yield put({
        type: "saveImages",
        payload: filterImages(giGroupAttachDTOList) || [],
      });
      yield put({ type: "saveDetailInfo", payload: data || {} });
      // 初始化保费，直接拿配置的最低保费字段
      yield put({
        type: "savePremium",
        payload: +data.premMin || 0,
      });
      // 保障方案
      yield put({
        type: "saveCondeInfo",
        payload: filterCondeType(giGroupCondDTOList) || [],
      });
      // 保障计划和选项关联
      const proj = filterProj(giGroupCondDTOList, giGroupPlanDTOList);
      yield put({
        type: "saveProj",
        payload: proj || [],
      });
      // 保障权益
      yield put({
        type: "saveLiab",
        payload: filterLiab(proj.defaultProject, guaranteeFlag) || [],
      });
      if (guaranteeFlag === "1") {
        // 如果勾选了保障权益才去判断是否需要找到主附组合险
        yield put({
          type: "saveGroupLiab",
          payload: filterGroupLiab(proj.defaultProject),
        });
      }

      // 如果有职业类别才请求
      if (data) {
        let profession = null;
        try {
          profession = yield call(loadProfessionData, companyCd);
        } catch (e) {
          profession = {};
        }
        const professionData = filterProfessionData(profession.data || []);
        yield put({ type: "saveProfession", payload: professionData });
      }
      yield put({ type: "saveTabs", payload: filterTabs(data) || {} });
      // 处理完毕，开始渲染
      yield put({ type: "saveEndState", payload: true });
    },
    *changePlan({ payload }, { put }) {
      yield put({
        type: "saveLiab",
        payload: filterLiab(payload) || [],
      });
    },
    *premiumTrial({ payload }, { call, put, select }) {
      const { planForm, liabForm } = payload;
      const { form: plan } = planForm.props;
      const { form: liab } = liabForm.props;
      const planValues = plan.getFieldsValue();
      const liabValues = liab.getFieldsValue();

      const { detailInfo } = yield select(store => store.detail);
      const { productId, giGroupPlanDTOList } = detailInfo;

      const params = filterPremium(
        productId,
        giGroupPlanDTOList[0].planId,
        planValues,
        liabValues
      );

      const res = yield call(compareAmount, params);
      const { response, data } = res;
      if (response.head.messageCd !== "0000") {
        Toast.fail(response.head.messageInf);
        return;
      }
      yield put({
        type: "savePremium",
        payload: +data.totalAmount,
      });
    },
    *porfAmountRule({ payload }, { put, select }) {
      const { liab } = yield select(store => store.detail);
      const profAmountLiab = ProfessionAmountRule(liab, payload);
      yield put({
        type: "saveProfAmountLiab",
        payload: profAmountLiab || [],
      });
    },
    *shareDetail({ payload }, { call }) {
      const res = yield call(share, payload);
      return res;
    },
  },
  reducers: {
    saveDetailInfo: (state, { payload }) => ({
      ...state,
      detailInfo: payload,
    }),
    saveTabs: (state, { payload }) => ({
      ...state,
      tabs: payload,
    }),
    saveCondeInfo: (state, { payload }) => ({
      ...state,
      condeType: payload,
    }),
    saveImages: (state, { payload }) => ({
      ...state,
      images: payload,
    }),
    saveProfession: (state, { payload }) => ({
      ...state,
      profession: payload,
    }),
    savePremium: (state, { payload }) => ({
      ...state,
      premium: payload,
    }),
    saveLiab: (state, { payload }) => ({
      ...state,
      liab: payload,
    }),
    saveGroupLiab: (state, { payload }) => ({
      ...state,
      groupLiab: payload,
    }),
    saveProfAmountLiab: (state, { payload }) => ({
      ...state,
      profAmountLiab: payload,
    }),
    saveProj: (state, { payload }) => ({
      ...state,
      project: payload.allProject,
      checkedProject: payload.defaultProject,
    }),
    saveEndState: (state, { payload }) => ({
      ...state,
      isEnd: payload,
    }),
    saveCheckedProfession: (state, { payload }) => ({
      ...state,
      checkedProf: payload,
    }),
    clear: () => ({ ...initState }),
  },
};
