// 责任关联
/**
 *
 * @param {object} itemKindsSupport 配置的责任信息 平级结构
 * @param {object} itemKinds 已选的责任 平级结构
 * @param {object} itemKind 当前点击的
 */
export const itemKindCheck = (itemKinds, itemKindsSupport, itemKind) => {
  const messages = [];
  // 开始检查
  let accidentHarm = null; // 意外伤害身故和残疾 CVYA001
  let accidentHarmSupport = null;
  let accidentHospital = null; // 意外住院和门急诊 CVJA017
  let accidentHospitalSupport = null;
  let accidentAllowance = null; // 意外住院津贴 CVJD006
  let accidentAllowanceSupport = null;
  let planeAccidentHarm = null; // 飞机意外伤害身故和残疾 CVYA008
  let planeAccidentHarmSupport = null;
  let trainAccidentHarm = null; // 火车意外伤害身故和残疾 CVYA009
  let trainAccidentHarmSupport = null;
  let shipAccidentHarm = null; // 轮船意外伤害身故和残疾 CVYA010
  let shipAccidentHarmSupport = null;
  let carAccidentHarm = null; // 汽车意外伤害身故和残疾 CVYA011
  let carAccidentHarmSupport = null;

  // 转变格式 方便取值
  const itemKindsSupportDic = {};
  for (let i = 0, { length } = itemKindsSupport; i < length; i += 1) {
    const itemKindsSupportItem = itemKindsSupport[i];
    const { liabilityInsCode } = itemKindsSupportItem;
    itemKindsSupportDic[
      itemKindsSupportItem.liabilityCode
    ] = itemKindsSupportItem;
    const { insuredAmounts } = itemKindsSupportItem;
    for (let j = 0, lengthJ = insuredAmounts.length; j < lengthJ; j += 1) {
      const insuredAmount = insuredAmounts[j];
      insuredAmount.supportInline = true;
    }
    switch (liabilityInsCode) {
      case "CVYA001":
        accidentHarmSupport = itemKindsSupportItem;
        break;
      case "CVJA017":
        accidentHospitalSupport = itemKindsSupportItem;
        break;
      case "CVJD006":
        accidentAllowanceSupport = itemKindsSupportItem;
        break;
      case "CVYA008":
        planeAccidentHarmSupport = itemKindsSupportItem;
        break;
      case "CVYA009":
        trainAccidentHarmSupport = itemKindsSupportItem;
        break;
      case "CVYA010":
        shipAccidentHarmSupport = itemKindsSupportItem;
        break;
      case "CVYA011":
        carAccidentHarmSupport = itemKindsSupportItem;
        break;
    }
  }

  let touchNotAccidentHarm = true;
  if (itemKind) {
    const { liabilityInsCode } = itemKind;
    if (
      liabilityInsCode === "CVYA008" ||
      liabilityInsCode === "CVYA009" ||
      liabilityInsCode === "CVYA010" ||
      liabilityInsCode === "CVYA011"
    ) {
      touchNotAccidentHarm = false;
    }
  }
  for (let i = 0, { length } = itemKinds; i < length; i += 1) {
    const itemKindsItem = itemKinds[i];
    const { liabilityCode } = itemKindsItem;
    const itemKindsSupport = itemKindsSupportDic[liabilityCode];
    const { liabilityInsCode } = itemKindsSupport;
    switch (liabilityInsCode) {
      case "CVYA001":
        accidentHarm = itemKindsItem;
        break;
      case "CVJA017":
        accidentHospital = itemKindsItem;
        break;
      case "CVJD006":
        accidentAllowance = itemKindsItem;
        break;
      case "CVYA008":
        planeAccidentHarm = itemKindsItem;
        break;
      case "CVYA009":
        trainAccidentHarm = itemKindsItem;
        break;
      case "CVYA010":
        shipAccidentHarm = itemKindsItem;
        break;
      case "CVYA011":
        carAccidentHarm = itemKindsItem;
        break;
    }
  }
  // 意外伤害身故和残疾 CVYA001 为必选责任
  if (accidentHarm === null) {
    messages.splice(0, 0, `${accidentHarmSupport.liabilityName}为必选责任`);
  }
  // 意外住院和门急诊 CVJA017 不得超过 意外伤害身故和残疾 CVYA001 50%
  if (accidentHospital !== null) {
    if (accidentHarm !== null) {
      const accidentHarmInsuredAmount = parseInt(
        accidentHarm.insuredAmount || 0,
        10
      );
      const accidentHospitalInsuredAmount = parseInt(
        accidentHospital.insuredAmount || 0,
        10
      );
      if (accidentHospitalInsuredAmount / accidentHarmInsuredAmount > 0.5) {
        messages.push(
          `${accidentHospital.liabilityName}保额不得超过${accidentHarm.liabilityName}保额50%`
        );
      }
    }
  }
  // 修改保额支持
  let accidentHospitalInsuredAmountMax = null;
  if (accidentHarm && accidentHarm.insuredAmountText) {
    const accidentHarmInsuredAmount = parseInt(
      accidentHarm.insuredAmount || 0,
      10
    );
    accidentHospitalInsuredAmountMax = accidentHarmInsuredAmount * 0.5;
  }
  if (
    itemKind &&
    itemKind.liabilityInsCode === accidentHarmSupport.liabilityInsCode &&
    itemKind.insuredAmountText
  ) {
    const accidentHarmInsuredAmount = parseInt(itemKind.insuredAmount || 0, 10);
    accidentHospitalInsuredAmountMax = accidentHarmInsuredAmount * 0.5;
  }
  let accidentHarmInsuredAmountMin = null;
  if (accidentHospital && accidentHospital.insuredAmountText) {
    const accidentHospitalInsuredAmount = parseInt(
      accidentHospital.insuredAmount || 0,
      10
    );
    accidentHarmInsuredAmountMin = accidentHospitalInsuredAmount * 2;
  }
  if (
    itemKind &&
    itemKind.liabilityInsCode === accidentHospitalSupport.liabilityInsCode &&
    itemKind.insuredAmountText
  ) {
    const accidentHospitalInsuredAmount = parseInt(
      itemKind.insuredAmount || 0,
      10
    );
    accidentHarmInsuredAmountMin = accidentHospitalInsuredAmount * 2;
  }

  if (accidentHospitalInsuredAmountMax !== null) {
    const { insuredAmounts } = accidentHospitalSupport;
    for (let i = 0, { length } = insuredAmounts; i < length; i += 1) {
      const insuredAmountItem = insuredAmounts[i];
      const { insuredAmount } = insuredAmountItem;
      if (insuredAmount > accidentHospitalInsuredAmountMax) {
        insuredAmountItem.supportInline = false;
      } else {
        insuredAmountItem.supportInline = true;
      }
    }
  }
  if (accidentHarmInsuredAmountMin !== null) {
    const { insuredAmounts } = accidentHarmSupport;
    for (let i = 0, { length } = insuredAmounts; i < length; i += 1) {
      const insuredAmountItem = insuredAmounts[i];
      const { insuredAmount } = insuredAmountItem;
      if (insuredAmount < accidentHarmInsuredAmountMin) {
        insuredAmountItem.supportInline = false;
      } else {
        insuredAmountItem.supportInline = true;
      }
    }
  }
  // 交通意外
  // 找保额下标
  let amountIndex = null;
  const findIndex = (_itemKind, _itemKindSupport) => {
    const { insuredAmounts } = _itemKindSupport;
    for (let i = 0, { length } = insuredAmounts; i < length; i += 1) {
      const insuredAmount = insuredAmounts[i];
      if (insuredAmount.insuredAmountText === _itemKind.insuredAmountText) {
        return i;
      }
    }
  };
  if (
    (itemKind &&
      itemKind.liabilityInsCode === planeAccidentHarmSupport.liabilityInsCode &&
      itemKind.insuredAmountText) ||
    (planeAccidentHarm &&
      planeAccidentHarm.insuredAmountText &&
      touchNotAccidentHarm)
  ) {
    amountIndex = findIndex(
      touchNotAccidentHarm ? planeAccidentHarm : itemKind || planeAccidentHarm,
      planeAccidentHarmSupport
    );
  } else if (
    (itemKind &&
      itemKind.liabilityInsCode === trainAccidentHarmSupport.liabilityInsCode &&
      itemKind.insuredAmountText) ||
    (trainAccidentHarm &&
      trainAccidentHarm.insuredAmountText &&
      touchNotAccidentHarm)
  ) {
    amountIndex = findIndex(
      touchNotAccidentHarm ? trainAccidentHarm : itemKind || trainAccidentHarm,
      trainAccidentHarmSupport
    );
  } else if (
    (itemKind &&
      itemKind.liabilityInsCode === shipAccidentHarmSupport.liabilityInsCode &&
      itemKind.insuredAmountText) ||
    (shipAccidentHarm &&
      shipAccidentHarm.insuredAmountText &&
      touchNotAccidentHarm)
  ) {
    amountIndex = findIndex(
      touchNotAccidentHarm ? shipAccidentHarm : itemKind || shipAccidentHarm,
      shipAccidentHarmSupport
    );
  } else if (
    (itemKind &&
      itemKind.liabilityInsCode === carAccidentHarmSupport.liabilityInsCode &&
      itemKind.insuredAmountText) ||
    (carAccidentHarm &&
      carAccidentHarm.insuredAmountText &&
      touchNotAccidentHarm)
  ) {
    amountIndex = findIndex(
      touchNotAccidentHarm ? carAccidentHarm : itemKind || carAccidentHarm,
      carAccidentHarmSupport
    );
  }
  const addItemKind = itemKindSupport => {
    const { insuredAmounts } = itemKindSupport;
    const { insuredAmount, amountUnit, insuredAmountText } = insuredAmounts[
      amountIndex
    ];
    itemKinds.push({
      liabilityName: itemKindSupport.liabilityName,
      liabilityTypeCode: itemKindSupport.liabilityTypeCode,
      liabilityInsCode: itemKindSupport.liabilityInsCode,
      liabilityAbstract: itemKindSupport.liabilityAbstract,
      liabilityDescribe: itemKindSupport.liabilityDescribe,
      liabilityCode: itemKindSupport.liabilityCode,
      insuredAmount: insuredAmount,
      amountUnit: amountUnit,
      insuredAmountText: insuredAmountText,
    });
  };
  const cleanItemKind = _itemKind => {
    _itemKind.insuredAmount = null;
    _itemKind.amountUnit = null;
    _itemKind.insuredAmountText = null;
  };
  const setItemKind = (_itemKind, _itemKindSupport) => {
    const { insuredAmounts } = _itemKindSupport;
    const { insuredAmount, amountUnit, insuredAmountText } = insuredAmounts[
      amountIndex
    ];
    _itemKind.insuredAmount = insuredAmount;
    _itemKind.amountUnit = amountUnit;
    _itemKind.insuredAmountText = insuredAmountText;
  };
  if (amountIndex === null || amountIndex === undefined) {
    if (planeAccidentHarm) {
      cleanItemKind(planeAccidentHarm);
    }
    if (trainAccidentHarm) {
      cleanItemKind(trainAccidentHarm);
    }
    if (shipAccidentHarm) {
      cleanItemKind(shipAccidentHarm);
    }
    if (carAccidentHarm) {
      cleanItemKind(carAccidentHarm);
    }
  } else {
    if (planeAccidentHarm === null) {
      addItemKind(planeAccidentHarmSupport);
    } else {
      setItemKind(planeAccidentHarm, planeAccidentHarmSupport);
    }
    if (trainAccidentHarm === null) {
      addItemKind(trainAccidentHarmSupport);
    } else {
      setItemKind(trainAccidentHarm, trainAccidentHarmSupport);
    }
    if (shipAccidentHarm === null) {
      addItemKind(shipAccidentHarmSupport);
    } else {
      setItemKind(shipAccidentHarm, shipAccidentHarmSupport);
    }
    if (carAccidentHarm === null) {
      addItemKind(carAccidentHarmSupport);
    } else {
      setItemKind(carAccidentHarm, carAccidentHarmSupport);
    }
  }
  // 交通意外翻转
  if (itemKind) {
    const { liabilityInsCode, insuredAmountText } = itemKind;
    if (!insuredAmountText) {
      if (
        liabilityInsCode === "CVYA008" ||
        liabilityInsCode === "CVYA009" ||
        liabilityInsCode === "CVYA010" ||
        liabilityInsCode === "CVYA011"
      ) {
        if (planeAccidentHarm !== null) {
          planeAccidentHarm.insuredAmount = null;
          planeAccidentHarm.amountUnit = null;
          planeAccidentHarm.insuredAmountText = null;
        }
        if (trainAccidentHarm !== null) {
          trainAccidentHarm.insuredAmount = null;
          trainAccidentHarm.amountUnit = null;
          trainAccidentHarm.insuredAmountText = null;
        }
        if (shipAccidentHarm !== null) {
          shipAccidentHarm.insuredAmount = null;
          shipAccidentHarm.amountUnit = null;
          shipAccidentHarm.insuredAmountText = null;
        }
        if (carAccidentHarm !== null) {
          carAccidentHarm.insuredAmount = null;
          carAccidentHarm.amountUnit = null;
          carAccidentHarm.insuredAmountText = null;
        }
      }
    }
  }

  return {
    messages,
    itemKinds,
    itemKindsSupport,
  };
};

// 提交检验
/**
 *
 * @param {object} insureInfo 投保信息
 */
// eslint-disable-next-line no-unused-vars
export const returnCheck = insureInfo => {};
