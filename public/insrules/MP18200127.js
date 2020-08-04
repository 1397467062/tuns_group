"use strict";

// 责任关联

/**
 *
 * @param {object} itemKindsSupport 配置的责任信息 平级结构
 * @param {object} itemKinds 已选的责任 平级结构
 * @param {object} itemKind 当前点击的
 */
var itemKindCheck = function itemKindCheck(
  itemKinds,
  itemKindsSupport,
  itemKind
) {
  var messages = []; // 开始检查

  var accidentHarm = null; // 意外伤害身故和残疾 CVYA001

  var accidentHarmSupport = null;
  var accidentHospital = null; // 意外住院和门急诊 CVJA017

  var accidentHospitalSupport = null;
  var accidentAllowance = null; // 意外住院津贴 CVJD006

  var accidentAllowanceSupport = null;
  var planeAccidentHarm = null; // 飞机意外伤害身故和残疾 CVYA008

  var planeAccidentHarmSupport = null;
  var trainAccidentHarm = null; // 火车意外伤害身故和残疾 CVYA009

  var trainAccidentHarmSupport = null;
  var shipAccidentHarm = null; // 轮船意外伤害身故和残疾 CVYA010

  var shipAccidentHarmSupport = null;
  var carAccidentHarm = null; // 汽车意外伤害身故和残疾 CVYA011

  var carAccidentHarmSupport = null; // 转变格式 方便取值

  var itemKindsSupportDic = {};

  for (var i = 0, length = itemKindsSupport.length; i < length; i += 1) {
    var itemKindsSupportItem = itemKindsSupport[i];
    var liabilityInsCode = itemKindsSupportItem.liabilityInsCode;
    itemKindsSupportDic[
      itemKindsSupportItem.liabilityCode
    ] = itemKindsSupportItem;
    var insuredAmounts = itemKindsSupportItem.insuredAmounts;

    for (var j = 0, lengthJ = insuredAmounts.length; j < lengthJ; j += 1) {
      var insuredAmount = insuredAmounts[j];
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

  var touchNotAccidentHarm = true;

  if (itemKind) {
    var _liabilityInsCode = itemKind.liabilityInsCode;

    if (
      _liabilityInsCode === "CVYA008" ||
      _liabilityInsCode === "CVYA009" ||
      _liabilityInsCode === "CVYA010" ||
      _liabilityInsCode === "CVYA011"
    ) {
      touchNotAccidentHarm = false;
    }
  }

  for (var _i = 0, _length = itemKinds.length; _i < _length; _i += 1) {
    var itemKindsItem = itemKinds[_i];
    var liabilityCode = itemKindsItem.liabilityCode;
    var _itemKindsSupport = itemKindsSupportDic[liabilityCode];
    var _liabilityInsCode2 = _itemKindsSupport.liabilityInsCode;

    switch (_liabilityInsCode2) {
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
  } // 意外伤害身故和残疾 CVYA001 为必选责任

  if (accidentHarm === null) {
    messages.splice(
      0,
      0,
      "".concat(
        accidentHarmSupport.liabilityName,
        "\u4E3A\u5FC5\u9009\u8D23\u4EFB"
      )
    );
  } // 意外住院和门急诊 CVJA017 不得超过 意外伤害身故和残疾 CVYA001 50%

  if (accidentHospital !== null) {
    if (accidentHarm !== null) {
      var accidentHarmInsuredAmount = parseInt(
        accidentHarm.insuredAmount || 0,
        10
      );
      var accidentHospitalInsuredAmount = parseInt(
        accidentHospital.insuredAmount || 0,
        10
      );

      if (accidentHospitalInsuredAmount / accidentHarmInsuredAmount > 0.5) {
        messages.push(
          ""
            .concat(
              accidentHospital.liabilityName,
              "\u4FDD\u989D\u4E0D\u5F97\u8D85\u8FC7"
            )
            .concat(accidentHarm.liabilityName, "\u4FDD\u989D50%")
        );
      }
    }
  } // 修改保额支持

  var accidentHospitalInsuredAmountMax = null;

  if (accidentHarm && accidentHarm.insuredAmountText) {
    var _accidentHarmInsuredAmount = parseInt(
      accidentHarm.insuredAmount || 0,
      10
    );

    accidentHospitalInsuredAmountMax = _accidentHarmInsuredAmount * 0.5;
  }

  if (
    itemKind &&
    itemKind.liabilityInsCode === accidentHarmSupport.liabilityInsCode &&
    itemKind.insuredAmountText
  ) {
    var _accidentHarmInsuredAmount2 = parseInt(itemKind.insuredAmount || 0, 10);

    accidentHospitalInsuredAmountMax = _accidentHarmInsuredAmount2 * 0.5;
  }

  var accidentHarmInsuredAmountMin = null;

  if (accidentHospital && accidentHospital.insuredAmountText) {
    var _accidentHospitalInsuredAmount = parseInt(
      accidentHospital.insuredAmount || 0,
      10
    );

    accidentHarmInsuredAmountMin = _accidentHospitalInsuredAmount * 2;
  }

  if (
    itemKind &&
    itemKind.liabilityInsCode === accidentHospitalSupport.liabilityInsCode &&
    itemKind.insuredAmountText
  ) {
    var _accidentHospitalInsuredAmount2 = parseInt(
      itemKind.insuredAmount || 0,
      10
    );

    accidentHarmInsuredAmountMin = _accidentHospitalInsuredAmount2 * 2;
  }

  if (accidentHospitalInsuredAmountMax !== null) {
    var _accidentHospitalSupp = accidentHospitalSupport,
      _insuredAmounts = _accidentHospitalSupp.insuredAmounts;

    for (
      var _i2 = 0, _length2 = _insuredAmounts.length;
      _i2 < _length2;
      _i2 += 1
    ) {
      var insuredAmountItem = _insuredAmounts[_i2];
      var _insuredAmount = insuredAmountItem.insuredAmount;

      if (_insuredAmount > accidentHospitalInsuredAmountMax) {
        insuredAmountItem.supportInline = false;
      } else {
        insuredAmountItem.supportInline = true;
      }
    }
  }

  if (accidentHarmInsuredAmountMin !== null) {
    var _accidentHarmSupport = accidentHarmSupport,
      _insuredAmounts2 = _accidentHarmSupport.insuredAmounts;

    for (
      var _i3 = 0, _length3 = _insuredAmounts2.length;
      _i3 < _length3;
      _i3 += 1
    ) {
      var _insuredAmountItem = _insuredAmounts2[_i3];
      var _insuredAmount2 = _insuredAmountItem.insuredAmount;

      if (_insuredAmount2 < accidentHarmInsuredAmountMin) {
        _insuredAmountItem.supportInline = false;
      } else {
        _insuredAmountItem.supportInline = true;
      }
    }
  } // 交通意外
  // 找保额下标

  var amountIndex = null;

  var findIndex = function findIndex(_itemKind, _itemKindSupport) {
    var insuredAmounts = _itemKindSupport.insuredAmounts;

    for (
      var _i4 = 0, _length4 = insuredAmounts.length;
      _i4 < _length4;
      _i4 += 1
    ) {
      var _insuredAmount3 = insuredAmounts[_i4];

      if (_insuredAmount3.insuredAmountText === _itemKind.insuredAmountText) {
        return _i4;
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

  var addItemKind = function addItemKind(itemKindSupport) {
    var insuredAmounts = itemKindSupport.insuredAmounts;
    var _insuredAmounts$amoun = insuredAmounts[amountIndex],
      insuredAmount = _insuredAmounts$amoun.insuredAmount,
      amountUnit = _insuredAmounts$amoun.amountUnit,
      insuredAmountText = _insuredAmounts$amoun.insuredAmountText;
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

  var cleanItemKind = function cleanItemKind(_itemKind) {
    _itemKind.insuredAmount = null;
    _itemKind.amountUnit = null;
    _itemKind.insuredAmountText = null;
  };

  var setItemKind = function setItemKind(_itemKind, _itemKindSupport) {
    var insuredAmounts = _itemKindSupport.insuredAmounts;
    var _insuredAmounts$amoun2 = insuredAmounts[amountIndex],
      insuredAmount = _insuredAmounts$amoun2.insuredAmount,
      amountUnit = _insuredAmounts$amoun2.amountUnit,
      insuredAmountText = _insuredAmounts$amoun2.insuredAmountText;
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
  } // 交通意外翻转

  if (itemKind) {
    var _liabilityInsCode3 = itemKind.liabilityInsCode,
      insuredAmountText = itemKind.insuredAmountText;

    if (!insuredAmountText) {
      if (
        _liabilityInsCode3 === "CVYA008" ||
        _liabilityInsCode3 === "CVYA009" ||
        _liabilityInsCode3 === "CVYA010" ||
        _liabilityInsCode3 === "CVYA011"
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
    messages: messages,
    itemKinds: itemKinds,
    itemKindsSupport: itemKindsSupport,
  };
}; // 提交检验

/**
 *
 * @param {object} insureInfo 投保信息
 */
// eslint-disable-next-line no-unused-vars

var returnCheck = function returnCheck(insureInfo) {};
