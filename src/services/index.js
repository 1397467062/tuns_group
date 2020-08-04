import { post, get } from "tuns-fetch-web";
import { isEmpty } from "tuns-utils";
import { Toast } from "antd-mobile";
import { getRunEnv } from "../utils";

const identityType = {
  "01": "身份证",
  "05": "护照",
  "06": "军官证",
  "07": "驾驶证",
  "99": "其他",
};

/**
 * 产品信息
 * @param {object} data
 * @param {string} data.productCode 产品代码
 */
export const loadProposalInfo = data => {
  return post("/ins/app/groupInsures/groupInsure", {
    insBasicId: data.proposalNumber,
  }).then((response = {}) => {
    const responseTemp = response.response || {};
    const head = responseTemp.head || {};
    const message = head.messageInf;
    if (head.messageCd === "0000") {
      // const responseData = response.data || {};
      const { proposalNumber } = data;
      const {
        appBasic,
        plans: resPlans,
        policyHolder: resHolder,
      } = response.data;
      const base = {
        proposalNumber: appBasic.insBasicId,
        planId: appBasic.planId,
        insuranceBegin: appBasic.startDate,
        insuranceEnd: appBasic.endDate,
        insurancePeriod: appBasic.insureTime,
        ageSupport: appBasic.insureAge,
        premium: appBasic.premAmount,
        invoiceTitle: appBasic.invoiceRise,
        invoiceEmail: appBasic.invoiceMail,
        identityNumber: appBasic.invoiceNumber,
      };
      const plans = [];
      resPlans.forEach((planItem, planIndex) => {
        plans.push({
          key: `plan_${planIndex}`,
          planName: planItem.insPlanName,
          itemKinds: planItem.guarantees.map(kindsItem => {
            return {
              liabilityCode: kindsItem.liabId,
              liabilityInsCode: kindsItem.liabBusiCode,
              liabilityTypeCode: kindsItem.riskLiabTypeId || kindsItem.riskId,
              liabilityName: kindsItem.showName || kindsItem.riskLiabTypeName,
              liabilityAbstract:
                kindsItem.riskLiabTypeName || kindsItem.riskName,
              liabilityDescribe: "",
              insuredAmount: kindsItem.amount,
              insuredAmountText: kindsItem.premDesc,
              amountUnit: kindsItem.unit,
            };
          }),
          professions: planItem.occupations.map(
            (professionItem, professionIndex) => {
              return {
                key: `profession_${professionIndex}`,
                professionId: professionItem.occupationNo,
                professionClassify: professionItem.occupationCode,
                professionCode: professionItem.occupationNo,
                professionName: professionItem.occupationName,
                insuredCount: Number(professionItem.insureNumber),
                insureds: professionItem.insurers.map(
                  (insuredItem, insuredIndex) => {
                    return {
                      key: `insured_${insuredIndex}`,
                      name: insuredItem.insuredName,
                      identityType: insuredItem.identificationType,
                      identityTypeName:
                        identityType[insuredItem.identificationType],
                      identityNumber: insuredItem.identificationNo,
                      sex: insuredItem.insuredSex,
                      birth: insuredItem.insureBirthday,
                    };
                  }
                ),
              };
            }
          ),
        });
      });

      const policyHolder = {
        companyName: resHolder.insureCompany,
        industries: resHolder.industryType,
        enterpriseNature: resHolder.industryNature,
        identityType: resHolder.identificationType,
        companyAddress: resHolder.companyAddress,
        contactName: resHolder.contactsName,
        contactPhone: resHolder.contactsPhone,
        contactEmail: resHolder.contactsEmail,
        identityImages: JSON.parse(resHolder.identificationUrl).map(
          imagesItem => {
            return {
              id: imagesItem.key,
              imageName: imagesItem.imageName,
              key: imagesItem.key,
              url: imagesItem.fullUrl,
              path: imagesItem.fullUrl,
              fileName: imagesItem.imageName,
            };
          }
        ),
        invoiceType: appBasic.invoiceNeedFlag,
        invoiceTitle: appBasic.invoiceRise,
        invoiceIdentityNumber: appBasic.invoiceNumber,
        invoiceEmail: appBasic.invoiceMail,
        identityNumber: resHolder.identificationNo,
      };

      return { base, plans, policyHolder, proposalNumber };
    } else {
      Toast.fail(message || "未知错误", 2);
      return null;
    }
  });
};

/**
 * 产品信息
 * @param {object} data
 * @param {string} data.productCode 产品代码
 */
export const loadProductInfo = data => {
  return post("/ins/app/oneOffer/insGroupDetails", {
    productId: data.productCode,
  }).then((response = {}) => {
    const responseData = response.data || {};
    /* 基本信息 */
    const base = {
      productCode: responseData.productId, // 产品代码
      productName: responseData.productName, // 产品名称
      premiumMin: responseData.premMin, // 最低保费
      productFeature: responseData.feature, // 产品特色
      productDescribe: responseData.brief, // 产品简介
      insTypeId: responseData.insTypeId,
      insTypeName: responseData.insTypeName,
    };
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `./insrules/${responseData.productCode}.js`;
    document.body.appendChild(script);
    /* 投保说明 */
    let inform = {};
    const groupNoticeDTO = responseData.groupNoticeDTO || {};
    const { healthNotice } = groupNoticeDTO;
    if (
      healthNotice !== null &&
      healthNotice !== undefined &&
      !isEmpty(healthNotice)
    ) {
      const buttons = [];
      const contents = [];
      const { buttonConf } = groupNoticeDTO;
      try {
        const buttonConfs = JSON.parse(buttonConf);
        buttonConfs.forEach(_buttonConf => {
          buttons.push({
            text: _buttonConf.btnValue,
            next: _buttonConf.btnType === "right",
          });
        });
      } catch (e) {
        buttons.push({
          text: "确定",
          next: true,
        });
      }
      contents.push({
        content: healthNotice,
      });
      inform.contents = contents;
      inform.buttons = buttons;
    } else {
      inform = null;
    }
    /* 投保须知 */
    const { claimNotice } = groupNoticeDTO;
    const instructions = [];
    instructions.push({
      instruction: claimNotice,
    });
    /* 理赔服务 */
    const { claimProcess } = groupNoticeDTO;
    const claimServices = [];
    claimServices.push({
      claimService: claimProcess,
    });
    /* 特别约定 */
    const specialAgreements = [];
    const groupAppointItemDTOList = responseData.groupAppointItemDTOList || [];
    groupAppointItemDTOList.forEach(groupAppointItemDTO => {
      specialAgreements.push({
        clauseCode: groupAppointItemDTO.itemId,
        clauseName: groupAppointItemDTO.itemExplain,
        clauseDetial: groupAppointItemDTO.itemNotice,
        clauseOrder: groupAppointItemDTO.itemOrder,
        constraint: "1",
        canModified: false,
      });
    });
    /* 责任部分 */
    const giGroupPlanDTOList = responseData.giGroupPlanDTOList || [];
    const giGroupPlanDTO =
      giGroupPlanDTOList.length > 0 ? giGroupPlanDTOList[0] : {};
    base.planCode = giGroupPlanDTO.planId; // 计划代码
    base.planId = giGroupPlanDTO.planId; // 计划ID
    // 创建一个新的 保险责任列表
    const itemKinds = [];
    const itemKindObjects = {};
    const giGroupPlanLiabDTOList = giGroupPlanDTO.giGroupPlanLiabDTOList || [];
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
          giGroupPlanLiabDTO.showName || giGroupPlanLiabDTO.liabName,
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
      // 外层只添加主险
      const { mainRiskId, riskId } = giGroupPlanLiabDTO;
      if (
        mainRiskId === null ||
        mainRiskId === undefined ||
        isEmpty(mainRiskId)
      ) {
        itemKinds.push(itemKind);
      }
      itemKindObjects[riskId] = itemKind;
    });
    // 处理附加险
    giGroupPlanLiabDTOList.forEach(giGroupPlanLiabDTO => {
      const { mainRiskId } = giGroupPlanLiabDTO;
      if (
        mainRiskId !== null &&
        mainRiskId !== undefined &&
        !isEmpty(mainRiskId)
      ) {
        const itemKindMain = itemKindObjects[mainRiskId];
        if (itemKindMain) {
          const itemKind = itemKindObjects[giGroupPlanLiabDTO.riskId];
          const itemKindsMain = itemKindMain.itemKinds || [];
          itemKindsMain.push(itemKind);
          itemKindMain.itemKinds = itemKindsMain;
        }
      }
    });
    /* 附件信息 */
    const banners = [];
    const pictures = [];
    let productLiabilitys = [];
    const giGroupAttachDTOList = responseData.giGroupAttachDTOList || [];
    giGroupAttachDTOList.forEach(giGroupAttachDTO => {
      const fileUrlStr = giGroupAttachDTO.fileUrl;
      try {
        const files = JSON.parse(fileUrlStr);
        files.forEach(file => {
          const { attachFullUrl, attachName } = file;
          if (
            attachFullUrl !== null &&
            attachFullUrl !== undefined &&
            !isEmpty(attachFullUrl)
          ) {
            const attachment = {
              attachmentName: giGroupAttachDTO.attachName,
              attachmentUrl: attachFullUrl,
              attachmentFileName: attachName,
              showType: giGroupAttachDTO.openType,
            };
            if (giGroupAttachDTO.attachType === "2") {
              // 产品附件 图片
              const { attachFileType } = giGroupAttachDTO;
              switch (attachFileType) {
                case "07": // logo
                  base.productIcon = attachment.attachmentUrl;
                  break;
                case "05": // 顶部
                  banners.push({
                    imageUrl: attachment.attachmentUrl,
                  });
                  break;
                case "01": // 底部
                  pictures.push({
                    imageUrl: attachment.attachmentUrl,
                  });
                  break;
                default:
                  break;
              }
            } else if (giGroupAttachDTO.attachType === "1") {
              const { attachFileType } = giGroupAttachDTO;
              if (attachFileType === "02") {
                try {
                  files.forEach(fileUrlItem => {
                    productLiabilitys.push({
                      name: fileUrlItem.attachName,
                      url: fileUrlItem.attachFullUrl,
                    });
                  });
                  // eslint-disable-next-line no-empty
                } catch (e) {}
              }
            }
          }
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
    });
    // 去重
    const productLiabilityMap = {};
    const productLiabilityNew = [];
    productLiabilitys.forEach(productLiability => {
      const productLiabilityTemp = productLiabilityMap[productLiability.name];
      if (!productLiabilityTemp) {
        productLiabilityNew.push(productLiability);
        productLiabilityMap[productLiability.name] = productLiability;
      }
    });
    productLiabilitys = productLiabilityNew;
    /* 参数 */
    const parameters = [];
    const giGroupCondDTOList = responseData.giGroupCondDTOList || [];
    for (let i = 0, { length } = giGroupCondDTOList; i < length; i += 1) {
      const giGroupCondDTO = giGroupCondDTOList[i];
      const { condCode } = giGroupCondDTO;
      const { condValueText } = giGroupCondDTO;
      if (condCode === "noncar_insurance_job") {
        let professionSupportTemp = condValueText.replace("类职业", "");
        professionSupportTemp = professionSupportTemp.replace("类", "");
        const professionSupportTemp2 = professionSupportTemp.split("-");
        const minProfession = professionSupportTemp2[0];
        const maxProfession = professionSupportTemp2[1];
        const professionSupport = [];
        for (
          let professionI = 1;
          professionI <= maxProfession && professionI >= minProfession;
          professionI += 1
        ) {
          professionSupport.push(`${professionI}`);
        }
        base.professionSupport = professionSupport;
        // eslint-disable-next-line no-continue
        continue;
      }
      const parameter = {
        code: giGroupCondDTO.condId,
        key: condCode,
        title: giGroupCondDTO.condName,
        text: condValueText,
        type: giGroupCondDTO.valueType,
        must: giGroupCondDTO.isNeed,
        tips: giGroupCondDTO.needTips,
        affectedPremium: giGroupCondDTO.effectPrem,
        show: giGroupCondDTO.showApp,
        defaultValue: null,
        minValue: null,
        intervalValue: null,
        maxValue: null,
      };
      const { groupOptionList } = giGroupCondDTO;
      if (groupOptionList && groupOptionList.length > 0) {
        const options = [];
        groupOptionList.forEach(groupOption => {
          if (groupOption.isDefault === "1") {
            parameter.defaultValue = groupOption.optionValue;
          }
          options.push({
            value: groupOption.optionValue,
            label: groupOption.optionText,
          });
        });
        parameter.options = options;
      }
      if (
        condValueText !== null &&
        condValueText !== undefined &&
        !isEmpty(condValueText)
      ) {
        parameter.defaultValue = condValueText;
      }
      parameters.push(parameter);
    }
    return {
      insuranceCarriersCode: responseData.companyCd, // 承保公司代码
      insuranceCarriersName: responseData.companyName, // 承保公司名称
      base,
      inform,
      instructions,
      claimServices,
      specialAgreements,
      itemKinds,
      banners,
      pictures,
      productLiabilitys,
      parameters,
    };
  });
};

/**
 * 保费试算
 * @param {object} data
 */
export const premiumCaculate = data => {
  const { base, plans, parameters } = data;
  // 组装数据
  const request = {
    planId: base.planId,
    productID: base.productCode,
    insureTime: base.insurancePeriod,
  };
  const results = [];
  request.results = results;

  plans.forEach(plan => {
    const result = {};
    results.push(result);
    const planDuties = [];
    const occupations = [];
    result.planDuties = planDuties;
    result.occupations = occupations;

    const { itemKinds, professions } = plan;
    itemKinds.forEach(itemKind => {
      planDuties.push({
        liabId: itemKind.liabilityCode,
        riskLiabTypeId: itemKind.riskLiabTypeId,
        amount: itemKind.insuredAmountText,
      });
    });
    professions.forEach(profession => {
      occupations.push({
        occupationCode: profession.professionClassify,
        insureNumber: profession.insuredCount,
      });
    });
  });

  return post("/ins/app/groupInsures/compareAmount", request).then(
    (response = {}) => {
      const responseData = response.data || {};
      const premium = responseData.totalAmount
        ? parseFloat(responseData.totalAmount)
        : 0;
      if (base.storage === "1") {
        // 组装试算存储数据
        base.premium = premium;
        const storageRequest = {
          productId: base.productCode,
          planId: base.planId,
          planCode: base.planCode,
          productModelId: base.productCode,
          productJson: JSON.stringify(base),
          guaranteeJson: JSON.stringify(plans),
          insuredAmount: 0,
          insuredUnit: "万",
          premium,
          insuredJson: JSON.stringify(parameters),
        };
        return post("/ins/app/groupInsures/modifyTrial", storageRequest).then(
          storageResponse => {
            const storageResponseData = storageResponse.data || {};

            const responseTemp = storageResponse.response || {};
            const head = responseTemp.head || {};
            const message = head.messageInf;
            if (head.messageCd === "0000") {
              return {
                base: {
                  premiumNumber: storageResponseData.trialId,
                  premium,
                },
              };
            } else {
              Toast.fail(message || "未知错误", 2);
              return {
                base: {
                  premium,
                },
              };
            }
          }
        );
      } else {
        return {
          base: {
            premium,
          },
        };
      }
    }
  );
};

/**
 * 保费试算详情
 * @param {object} data
 * @param {object} data.premiumNumber 试算单号
 */
export const premiumCaculateInfo = data => {
  const request = {
    trialId: data.premiumNumber,
  };
  return post("/ins/app/groupInsures/trialDetail", request).then(response => {
    const responseData = response.data || {};
    return {
      premiumNumber: data.premiumNumber,
      base: responseData.productJson
        ? JSON.parse(responseData.productJson)
        : {},
      plans: responseData.guaranteeJson
        ? JSON.parse(responseData.guaranteeJson)
        : [],
      parameters: responseData.insuredJson
        ? JSON.parse(responseData.insuredJson)
        : {},
    };
  });
};

/**
 * 产品投保信息
 * @param {object} data
 * @param {string} data.productCode 产品代码
 */
export const loadProductInsureInfo = data => {
  return post("/ins/app/groupInsures/searchInsInitData", {
    productId: data.productCode,
    inqBasicId: data.premiumNumber,
  }).then((response = {}) => {
    const responseData = response.data || {};
    /* 基本信息 */
    const base = {
      productCode: responseData.productId, // 产品代码
    };
    /* 责任部分 */
    const giGroupPlanDTOList = responseData.groupPlanDTOS || [];
    const giGroupPlanDTO =
      giGroupPlanDTOList.length > 0 ? giGroupPlanDTOList[0] : {};
    base.planCode = giGroupPlanDTO.planCode; // 计划代码
    base.planId = giGroupPlanDTO.planId; // 计划ID
    // 创建一个新的 保险责任列表
    const itemKinds = [];
    const itemKindObjects = {};
    const giGroupPlanLiabDTOList = giGroupPlanDTO.planLiabInfoList || [];
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
          giGroupPlanLiabDTO.showName || giGroupPlanLiabDTO.liabName,
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
      // 外层只添加主险
      const { mainRiskId, riskId } = giGroupPlanLiabDTO;
      if (
        mainRiskId === null ||
        mainRiskId === undefined ||
        isEmpty(mainRiskId)
      ) {
        itemKinds.push(itemKind);
      }
      itemKindObjects[riskId] = itemKind;
    });
    /* 参数 */
    const parameters = [];
    const policyHolderParameters = [];
    const policyHolderContactParameters = [];
    const groupModelDTOS = responseData.groupModelDTOS || [];
    let insHolderModel;
    groupModelDTOS.forEach(groupModelDTO => {
      if (groupModelDTO.modelCode === "insHolderModel") {
        insHolderModel = groupModelDTO;
      } else {
        const giGroupCondDTOList = groupModelDTO.modelDetails || [];
        for (let i = 0, { length } = giGroupCondDTOList; i < length; i += 1) {
          const giGroupCondDTO = giGroupCondDTOList[i];
          const { pageElCode } = giGroupCondDTO;
          const { defaultValue } = giGroupCondDTO;
          const parameter = {
            code: giGroupCondDTO.pageElId,
            key: pageElCode,
            title: giGroupCondDTO.pageElName,
            text: defaultValue,
            type: giGroupCondDTO.pageElType,
            must: giGroupCondDTO.isNeed,
            tips: giGroupCondDTO.needTips,
            affectedPremium: null,
            show: giGroupCondDTO.isDefaultShow,
            defaultValue,
            minValue: giGroupCondDTO.minValue,
            intervalValue: null,
            maxValue: giGroupCondDTO.maxValue,
          };
          let { elOptions } = giGroupCondDTO;
          if (elOptions) {
            try {
              elOptions = JSON.parse(elOptions);
              const compare = property => {
                return (a, b) => {
                  const value1 = a[property];
                  const value2 = b[property];
                  return value1 - value2;
                };
              };
              elOptions.sort(compare("order"));
              // eslint-disable-next-line no-empty
            } catch (e) {}
          }
          if (elOptions && elOptions.length > 0) {
            const options = [];
            elOptions.forEach(elOption => {
              if (elOption.isDefault === "1" || elOption.isDefault === "Y") {
                parameter.defaultValue = elOption.value;
              }
              options.push({
                value: elOption.value,
                label: elOption.name,
              });
            });
            parameter.options = options;
          }
          if (
            defaultValue !== null &&
            defaultValue !== undefined &&
            !isEmpty(defaultValue)
          ) {
            parameter.defaultValue = defaultValue;
          }
          if (groupModelDTO.modelCode === "insHolderInfoModel") {
            policyHolderParameters.push(parameter);
          } else if (groupModelDTO.modelCode === "insContactsModel") {
            policyHolderContactParameters.push(parameter);
          }
        }
      }
    });
    if (!insHolderModel) {
      insHolderModel = {};
    }
    const giGroupCondDTOList = insHolderModel.modelDetails || [];
    const parameterKeys = {
      insureTime: "insurancePeriod",
      insureAge: "ageSupport",
      insured_number: "insuredCountSupport",
      startDate: "insuranceBegin",
      endDate: "insuranceEnd",
    };
    for (let i = 0, { length } = giGroupCondDTOList; i < length; i += 1) {
      const giGroupCondDTO = giGroupCondDTOList[i];
      let { pageElCode } = giGroupCondDTO;
      const { defaultValue } = giGroupCondDTO;
      if (pageElCode === "noncar_insurance_job") {
        let professionSupportTemp = defaultValue.replace("类职业", "");
        professionSupportTemp = professionSupportTemp.replace("类", "");
        const professionSupportTemp2 = professionSupportTemp.split("-");
        const minProfession = professionSupportTemp2[0];
        const maxProfession = professionSupportTemp2[1];
        const professionSupport = [];
        for (
          let professionI = 1;
          professionI <= maxProfession && professionI >= minProfession;
          professionI += 1
        ) {
          professionSupport.push(`${professionI}`);
        }
        base.professionSupport = professionSupport;
        // eslint-disable-next-line no-continue
        continue;
      } else if (
        Object.prototype.hasOwnProperty.call(parameterKeys, pageElCode)
      ) {
        pageElCode = parameterKeys[pageElCode];
      }
      const parameter = {
        code: giGroupCondDTO.pageElId,
        key: pageElCode,
        title: giGroupCondDTO.pageElName,
        text: defaultValue,
        type: giGroupCondDTO.pageElType,
        must: giGroupCondDTO.isNeed,
        tips: giGroupCondDTO.needTips,
        affectedPremium: null,
        show: giGroupCondDTO.isDefaultShow,
        defaultValue,
        minValue: giGroupCondDTO.minValue,
        intervalValue: null,
        maxValue: giGroupCondDTO.maxValue,
      };
      let { elOptions } = giGroupCondDTO;
      if (elOptions) {
        try {
          elOptions = JSON.parse(elOptions);
          const compare = property => {
            return (a, b) => {
              const value1 = a[property];
              const value2 = b[property];
              return value1 - value2;
            };
          };
          elOptions.sort(compare("order"));
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      if (elOptions && elOptions.length > 0) {
        const options = [];
        elOptions.forEach(elOption => {
          if (elOption.isDefault === "1" || elOption.isDefault === "Y") {
            parameter.defaultValue = elOption.value;
          }
          options.push({
            value: elOption.value,
            label: elOption.name,
          });
        });
        parameter.options = options;
      } else if (
        pageElCode === "insuranceBegin" ||
        pageElCode === "insuranceEnd"
      ) {
        const {
          startDateRule,
          startTimeRule,
          dateInterval,
          dateIntervalUnit,
        } = giGroupCondDTO;
        parameter.minValue = `0,0,${startDateRule},${startTimeRule},0,0`;
        let Y = 0;
        let M = 0;
        let D = 0;
        let H = 0;
        switch (dateIntervalUnit) {
          case "Y":
            Y = dateInterval;
            break;
          case "M":
            M = dateInterval;
            break;
          case "D":
            D = dateInterval;
            break;
          case "H":
            H = dateInterval;
            break;
          default:
            break;
        }
        parameter.intervalValue = `${Y},${M},${D},${H},0,0`;
      }
      if (
        defaultValue !== null &&
        defaultValue !== undefined &&
        !isEmpty(defaultValue)
      ) {
        parameter.defaultValue = defaultValue;
      }
      parameters.push(parameter);
    }
    return {
      premiumNumber: responseData.inqBasicId,
      insuranceCarriersCode: giGroupPlanDTO.companyCode, // 承保公司代码
      insuranceCarriersName: giGroupPlanDTO.companyName, // 承保公司名称
      base,
      itemKinds,
      parameters,
      policyHolderParameters,
      policyHolderContactParameters,
    };
  });
};

/**
 * 投保/暂存
 * @param {object} data
 */
export const proposalSave = data => {
  const {
    base,
    plans,
    parameters,
    policyHolder,
    storage,
    proposalNumber,
    premiumNumber,
    salesman,
    invoice,
  } = data;
  const request = {
    storage,
    planCode: base.planCode,
    planId: base.planId,
    productId: base.productCode,
    insBasicId: proposalNumber,
    inqBasicId: premiumNumber,
    salesmaneId: salesman.code,
    salesman: {
      id: salesman.code,
    },
  };
  const requestBasic = {
    insBasicId: proposalNumber,
    inqBasicId: premiumNumber,
    planId: base.planId,
    startDate: base.insuranceBegin,
    endDate: base.insuranceEnd,
    insureTime: base.insurancePeriod,
    insureAge: base.ageSupport,
    premAmount: base.premium,
    invoiceRise: invoice.invoiceTitle,
    invoiceNeedFlag: invoice.invoiceType,
    invoiceNumber: invoice.identityNumber,
    invoiceMail: invoice.invoiceEmail,
  };
  request.basic = requestBasic;
  const { identityImages } = policyHolder;
  const requestPolicyHolder = {
    insCompanyId: null, // 投保业务ID
    customerType: "2", // 客户类型
    custId: null, // 客户ID
    customerCode: null, // 客户代码
    insureCompany: policyHolder.companyName, // 投保单位
    identificationType: policyHolder.identityType, // 投保单位证件类型
    identificationNo: policyHolder.identityNumber, // 投保单位证件号码
    industryType: policyHolder.industries, // 所属行业
    industryNature: policyHolder.enterpriseNature, // 行业性质
    contactsName: policyHolder.contactName, // 单位联系人名称
    contactsPhone: policyHolder.contactPhone, // 单位联系人电话
    contactsEmail: policyHolder.contactEmail, // 单位联系人邮箱
    contactsTelphone: policyHolder.contactPhone, // 办公电话
    identificationUrl: JSON.stringify(identityImages), // 证件照
  };
  request.policyHolder = requestPolicyHolder;
  // 自定义参数
  const requestParameters = {};
  request.parameters = requestParameters;
  const parameterKeys = {
    insurancePeriod: "insureTime",
    ageSupport: "insureAge",
    insuredCountSupport: "insured_number",
    insuranceBegin: "startDate",
    insuranceEnd: "endDate",
  };
  for (let key in parameters) {
    if (Object.prototype.hasOwnProperty.call(parameters, key)) {
      const value = parameters[key];
      if (Object.prototype.hasOwnProperty.call(parameterKeys, key)) {
        key = parameterKeys[key];
      }
      requestParameters[key] = value;
    }
  }
  // 计划
  const requestPlans = [];
  request.plans = requestPlans;
  plans.forEach((plan, index) => {
    const requestPlan = {
      insPlanId: null, // 投保计划ID
      insPlanName: plan.planName, // 投保计划名称
      insPlanOrder: index, // 投保计划序号
    };
    requestPlans.push(requestPlan);
    const { itemKinds, professions } = plan;
    const requestGuarantees = [];
    requestPlan.guarantees = requestGuarantees;
    itemKinds.forEach(itemKind => {
      const requestGuarantee = {
        guaranteeId: null, // 投保保障ID
        liabId: itemKind.liabilityCode, // 险种类型保障责任
        riskLiabTypeId: itemKind.liabilityTypeCode, // 险种类型保障ID
        riskLiabTypeName: itemKind.liabilityAbstract, // 险种类型保障责任名称
        amount: itemKind.insuredAmount, // 保额
        unit: itemKind.amountUnit, // 单位
        premDesc: itemKind.insuredAmountText, // 保额或文字说明
      };
      requestGuarantees.push(requestGuarantee);
    });
    const requestOccupations = [];
    requestPlan.occupations = requestOccupations;
    professions.forEach(profession => {
      const requestOccupation = {
        occupationId: profession.professionId, // 被保险人职业ID
        occupationCode: profession.professionClassify, // 职业类型
        occupationNo: profession.professionCode, // 职业代码
        occupationName: profession.professionName, // 职业名称
        insureNumber: profession.insuredCount, // 被保险人数
      };
      requestOccupations.push(requestOccupation);
      const { insureds } = profession;
      const requestInsurers = [];
      requestOccupation.insurers = requestInsurers;
      insureds.forEach((insured, insuredIndex) => {
        const requestInsurer = {
          insuredId: null, // 被保险人ID
          insuredOrder: insuredIndex, // 序号
          insuredName: insured.name, // 被保险人姓名
          identificationType: insured.identityType, // 证件类型
          identificationNo: insured.identityNumber, // 证件号码
          insuredSex: insured.sex, // 性别
          insuredOccupation: profession.professionCode, // 职业
          inusredAge: null, // 年龄
          beneficialPerson: null, // 受益人
          insureBirthday: insured.birth, // 生日
        };
        requestInsurers.push(requestInsurer);
      });
    });
  });
  return post(
    storage === "1"
      ? "/ins/app/groupInsures/storageInsures"
      : "/ins/app/groupInsures/applyInsures",
    request
  ).then(response => {
    const responseTemp = response.response || {};
    const head = responseTemp.head || {};
    const message = head.messageInf;
    if (head.messageCd === "0000") {
      const responseData = response.data || {};
      // const basic = responseData.basic || {};
      return { proposalNumber: proposalNumber || responseData.insBasicId };
    } else {
      Toast.fail(message || "未知错误", 2);
      return null;
    }
  });
};

/**
 * 投保/暂存单查询
 * @param {object} data
 * @param {object} data.proposalNumber 投保单号
 * @param {object} data.storageNumber 暂存单号
 */
export const proposalInfo = data => {
  return post("/ins/app/gi/proposalInfo", data);
};

/**
 * 订单查询
 * @param {object} data
 * @param {object} data.orderUuid 订单编号
 */
export const orderInfo = data => {
  return post("/ins/app/gi/orderInfo", data);
};

/**
 * 职业查询
 * @param {*} data
 */
export const loadProfessionData = data =>
  get(
    `${
      getRunEnv() === "pro" ? "https://" : "http://test."
    }file.tuns.com.cn/tuns/library/profession/GI_${data}.json`,
    {},
    {
      isCheck: false,
    }
  ).then(response => {
    const newData = response.data.map(item => {
      return {
        id: item.code,
        value: item.code,
        name: item.name,
        children: item.options.map(it => {
          return {
            id: it.code,
            value: it.code,
            name: it.name,
            children: it.options.map(i => {
              return {
                id: i.code,
                value: i.code,
                name: i.name,
                classify: i.classify,
              };
            }),
          };
        }),
      };
    });
    return newData;
  });

/**
 * 分享
 * @param {object} data
 * @param {string} data.shareType 分享类型 1 询价结果分享（querySetId、inqBasicId必填） 2 团险分享（planId、productId必填） 3保费试算分享（trialId必填）
 * @param {string} data.inqBasicId 询价基础表ID
 * @param {Array} data.querySetId 询价计划查询ID集合
 * @param {string} data.planId 计划ID
 * @param {string} data.productId 产品ID
 * @param {string} data.trialId 试算ID
 */
export const share = data => {
  return post("/ins/app/oneOffer/share", data);
};
