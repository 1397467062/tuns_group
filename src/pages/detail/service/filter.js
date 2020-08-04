// 展开数组
const flattenDeep = arr => {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []
  );
};
// tab栏的数据
const filterTabs = data => {
  if (!data) {
    return {};
  }
  const { groupNoticeDTO, giGroupAttachDTOList } = data;
  const terms = filterTerms(giGroupAttachDTOList);
  return {
    buyNotice: groupNoticeDTO.claimNotice,
    claimProcess: groupNoticeDTO.claimProcess,
    terms,
  };
};

// 筛选投保条件
const filterCondeType = data => {
  if (!data || data.length === 0) {
    return [];
  }
  return data.map(item => {
    return {
      id: item.id,
      name: item.condCode,
      title: item.condName,
      type: item.valueType,
      text: item.condValueText,
      isNeed: item.isNeed,
      needTips: item.needTips,
      countPrem: item.effectPrem,
      isShow: item.showApp,
      isDefault: filterDefaultData(item.condOptions),
      data: filterCondeData(item.condOptions, item.valueType),
      condRuleList: item.giGroupRuleDTOSList || [],
    };
  });
};

// 筛选选项数据
const filterCondeData = (data, type) => {
  const datas = JSON.parse(data);
  if (type === "01") {
    if (datas.length > 3) {
      return datas.map(item => {
        return {
          value: item.optionValue,
          label: item.optionText,
        };
      });
    } else {
      return datas.map(item => {
        return {
          id: item.optionCode,
          value: item.optionValue,
          name: item.optionText,
        };
      });
    }
  } else {
    return datas;
  }
};
// 筛选默认值
const filterDefaultData = data => {
  const datas = JSON.parse(data);

  if (datas.length === 0) {
    return "";
  }
  const value = datas.filter(item => {
    return item.isDefault === "1";
  });
  if (value.length === 0) {
    return "";
  }
  return value[0].optionValue;
};

// 筛选图片附件
const filterImages = data => {
  const images = {
    "01": [
      "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
    ],
    "05": [
      "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
    ],
    "07": [
      "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
    ],
  };
  if (!data || data.length === 0) {
    return images;
  }
  const imageItem = data.filter(item => {
    return item.attachType === "2";
  });
  imageItem.forEach(item => {
    images[item.attachFileType] = item.fileFullUrl;
  });
  return images;
};
// 筛选条款
const filterTerms = data => {
  let terms = data.filter(item => {
    return item.attachType === "1";
  });
  terms = terms.filter(item => {
    return item.attachFileType === "02";
  });
  terms = terms.map(item => {
    return JSON.parse(item.fileUrl);
  });
  const list = flattenDeep(terms);
  // 去重
  for (let i = 0, len = list.length; i < len; i += 1) {
    for (let j = i + 1; j < len; j += 1) {
      if (list[i].attachName === list[j].attachName) {
        list.splice(j, 1);
        len -= 1;
        j -= 1;
      }
    }
  }
  return list;
};

// 过滤职业类别数据
const filterProfessionData = data => {
  return data.map(item => {
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
              value: i.classify,
              name: i.name,
              classify: i.classify,
            };
          }),
        };
      }),
    };
  });
};

// 筛选计划
const filterProj = (prod, proj) => {
  if (!prod || !proj || prod.length === 0 || proj.length === 0) {
    return [];
  }
  const allProject = new Map();
  let defaultProjId;
  prod.forEach(item => {
    if (item.condCode === "noncar_insurance_guarantee_proj") {
      item.groupOptionList.forEach(it => {
        if (it.isDefault === "1") {
          defaultProjId = it.relateProjectId;
        }
        proj.forEach(i => {
          if (i.planId === it.relateProjectId) {
            allProject.set(i.planId, i);
          }
        });
      });
    }
  });
  const defaultProject = allProject.get(defaultProjId);
  return { allProject, defaultProject };
};

// 筛选保障权益
const filterLiab = (data, flag) => {
  if (!data || data.length === 0) {
    return [];
  }
  const { giGroupPlanLiabDTOList: list } = data;

  // 判断是否勾选保障责任 “0”为未勾选 那么不需要判断主附险 "1"需要找到没有附险的主险和没有主险的附险
  const liabList =
    flag === "1"
      ? list.filter(item => item.mainRiskFlag === "0" && !item.mainRiskId)
      : list;
  if (liabList.length === 0) {
    return [];
  }
  return liabList.map(item => {
    return {
      id: item.liabBusiCode,
      liabId: item.liabId,
      title: item.showName,
      name: item.liabBusiCode,
      type: item.premType,
      text: item.premDesc,
      detailValue: item.riskLiabDetail,
      data: filterOptions(item.premAmountList, item.liabId),
      code: item.liabBusiCode,
    };
  });
};

// 处理权益保额的选项部分
const filterOptions = (data, liabId) => {
  return data.map((item, index) => {
    return {
      id: `${item.premUnit}_${index}`,
      value: {
        liabId,
        amount: item.premDesc,
      },
      name: item.premDesc,
      jobTypes: item.jobType,
    };
  });
};
// 处理组合形式的权益
const filterGroupLiab = data => {
  if (!data || data.length === 0) {
    return [];
  }
  const { giGroupPlanLiabDTOList: list } = data;
  // 主险
  const gropList = list.filter(item => item.mainRiskFlag === "1");
  if (gropList.length === 0) {
    return [];
  }
  const newData = [];
  list.forEach(item => {
    // 组合形式必须 先要找到主附险 然后组合
    const indexFound = gropList.findIndex(
      newItem => newItem.riskId === item.mainRiskId
    );
    const groupList = {
      id: item.riskId,
      title: item.showName,
      content: item.riskLiabDetail,
      value: {
        liabId: item.liabId,
        amount: item.premDesc,
      },
    };
    if (indexFound > -1) {
      newData[indexFound].data.push(groupList);
    } else {
      newData.push({
        id: item.riskId,
        value: `${item.premDesc}_${item.liabId}`,
        liabId: item.liabId,
        data: [groupList],
        // 如果是单个主险的时候 需要这些数据来展示另一种组件
        title: item.showName,
        name: `noncar_insurance_liability_${item.liabId}`,
        type: item.premType,
        text: item.premDesc,
        detailValue: item.riskLiabDetail,
        info: filterOptions(item.premAmountList, item.liabId),
      });
    }
  });
  return newData;
};

// 保费格式处理
const filterPremium = (productId, planId, plan, liab) => {
  const planDuties = [];
  for (const key in liab) {
    if (Object.prototype.hasOwnProperty.call(liab, key)) {
      if (liab[key] && typeof liab[key] === "string") {
        const keys = JSON.parse(liab[key]);
        planDuties.push(keys);
      } else {
        planDuties.push(liab[key]);
      }
    }
  }
  const {
    noncar_insurance_time_limit: insureTime,
    noncar_insurance_job: occupationCode,
  } = plan;
  const params = {
    productID: productId,
    planId,
    insureTime: typeof insureTime === "object" ? insureTime[0] : insureTime,
    results: [
      {
        planDuties,
        occupations: [{ occupationCode, insureNumber: 1 }],
      },
    ],
  };

  return params;
};

/**
 * 职业=>保额
 * 处理职业影响保额选择问题 每次弹出时运算
 * @param {string} liab 计划信息
 * @param {array} professionClassify 选择的职业类别
 */
export const ProfessionAmountRule = (liab, professionClassify) => {
  // 根据已选择的职业判断保额是否可选
  liab.forEach(liabItem => {
    const liabAmounts = liabItem.data || [];
    liabAmounts.forEach(insuredAmount => {
      const jobTypes = insuredAmount.jobTypes
        ? JSON.parse(insuredAmount.jobTypes)
        : [];
      let support = true;
      if (jobTypes.length > 0) {
        for (let k = 0, lengthK = jobTypes.length; k < lengthK; k += 1) {
          if (jobTypes.indexOf(professionClassify) === -1) {
            support = false;
            break;
          }
        }
      }
      insuredAmount.support = support;
    });
  });
  return liab;
};

export {
  filterTabs,
  filterCondeType,
  filterImages,
  filterProfessionData,
  filterLiab,
  filterProj,
  filterGroupLiab,
  filterPremium,
};
