/**
 * 职业=>保额
 * 处理职业影响保额选择问题 每次弹出时运算
 * @param {string} plan 计划信息
 * @param {array} itemKindsSupport 配置的责任信息
 * @param {array} defaultProfessionSupport 默认职业支持
 */
export const ProfessionAmountRule = (
  plan,
  itemKindsSupport,
  defaultProfessionSupport
) => {
  const itemKindsSupportDic = {};
  const professions = plan.professions || [];
  const itemKinds = plan.itemKinds || [];
  // 已选择的职业类别
  const professionClassifys = [];
  for (let i = 0, { length } = professions; i < length; i += 1) {
    const profession = professions[i];
    const { professionClassify } = profession;
    if (professionClassify) {
      professionClassifys.push(professionClassify);
    }
  }
  // 根据已选择的职业判断保额是否可选
  const itemKindsSupportTemp = itemKindsSupport;
  for (let i = 0, { length } = itemKindsSupportTemp; i < length; i += 1) {
    const itemKindSupport = itemKindsSupportTemp[i];
    itemKindsSupportDic[itemKindSupport.liabilityCode] = itemKindSupport;
    const insuredAmounts = itemKindSupport.insuredAmounts || [];
    for (let j = 0, lengthJ = insuredAmounts.length; j < lengthJ; j += 1) {
      const insuredAmount = insuredAmounts[j];
      const professionClassifySupport =
        insuredAmount.professionClassifySupport || [];
      let support = true;
      // 保额受职业控制
      if (professionClassifySupport.length > 0) {
        for (
          let k = 0, lengthK = professionClassifys.length;
          k < lengthK;
          k += 1
        ) {
          const professionClassify = professionClassifys[k];
          // 有任意一个职业不受支持 则 该保额不可选
          if (professionClassifySupport.indexOf(professionClassify) === -1) {
            support = false;
            break;
          }
        }
      }
      insuredAmount.support = support;
    }
  }
  let message = null;
  // 根据已选择的保额判断职业是否可选
  let defaultProfessionSupportTemp = JSON.parse(
    JSON.stringify(defaultProfessionSupport)
  );
  if (itemKinds.length > 0) {
    for (let i = 0, { length } = itemKinds; i < length; i += 1) {
      const itemKind = itemKinds[i];
      const { liabilityCode } = itemKind;
      const itemKindSupport = itemKindsSupportDic[liabilityCode];
      if (itemKindSupport) {
        const { insuredAmounts } = itemKindSupport;
        for (let j = 0, lengthJ = insuredAmounts.length; j < lengthJ; j += 1) {
          const insuredAmount = insuredAmounts[j];
          const { professionClassifySupport } = insuredAmount;
          // 校验当前已选保额是否支持当前已选职业
          if (!message) {
            for (
              let m = 0, lengthM = professionClassifys.length;
              m < lengthM;
              m += 1
            ) {
              const professionClassify = professionClassifys[m];
              if (
                professionClassifySupport.indexOf(professionClassify) === -1
              ) {
                // 这个职业不被支持
                message = `被保人类型${m + 1}的职业类型不支持当前计划方案`;
              }
            }
          }

          if (insuredAmount.insuredAmountText === itemKind.insuredAmountText) {
            if (
              professionClassifySupport &&
              professionClassifySupport.length > 0
            ) {
              const newDefaultProfessionSupportTemp = [];
              for (
                let k = 0, lengthK = professionClassifySupport.length;
                k < lengthK;
                k += 1
              ) {
                const professionClassifySupportItem =
                  professionClassifySupport[k];
                for (
                  let l = 0, lengthL = defaultProfessionSupportTemp.length;
                  l < lengthL;
                  l += 1
                ) {
                  const defaultProfessionSupportTempItem =
                    defaultProfessionSupportTemp[l];
                  if (
                    defaultProfessionSupportTempItem ===
                    professionClassifySupportItem
                  ) {
                    newDefaultProfessionSupportTemp.push(
                      defaultProfessionSupportTempItem
                    );
                  }
                }
              }
              defaultProfessionSupportTemp = newDefaultProfessionSupportTemp;
              break;
            }
          }
        }
      }
    }
  }
  return {
    message,
    professionSupport: defaultProfessionSupportTemp,
    itemKindsSupport,
  };
};
