import { compare } from "utils/rules";

const pickRule = (optionList, condCode, form, array) => {
  let NY = false;
  // condCode：该规则对应的条件字段，如typeRule为1时，数据为app投保信息配置的模块编码和元素编码，如ins_plan:insurance_plan，:前为模块编码，:后为页面元素编码
  // 如typeRule为0时，数据为投保条件编码，
  const codeArr = condCode.split(":");
  // value 对比
  // optionList=[{"code":"01","value":"身份证"},{"code":"005","value":"护照"}]
  if (codeArr[0] === "insuredTypeModel") {
    array.forEach(dot => {
      let value = form.getFieldValue(`${condCode}_${dot.pageElKey}`);
      if (Array.isArray(value)) {
        value = value.join(",");
      }
      optionList.forEach(data => {
        if (value === data.code) {
          NY = true;
        }
      });
    });
  } else {
    let value = form.getFieldValue(condCode);
    if (Array.isArray(value)) {
      value = value.join(",");
    }

    optionList.forEach(data => {
      if (value === data.code) {
        NY = true;
      }
    });
  }
  return NY;
};

const ratioRule = (condRule, condCode, form, array) => {
  let NY = false;
  const codeArr = condCode.split(":");
  // condCode：该规则对应的条件字段，如typeRule为1时，数据为app投保信息配置的模块编码和元素编码，如ins_plan:insurance_plan，:前为模块编码，:后为页面元素编码
  // 如typeRule为0时，数据为投保条件编码， ---typeRule 只能为1
  if (codeArr[0] === "insuredTypeModel") {
    array.forEach(dot => {
      const value = form.getFieldValue(`${condCode}_${dot.pageElKey}`);
      if (codeArr[1] === "profession") {
        // 职业类别 特殊处理
        if (!compare(value.class, condRule)) NY = true;
      } else if (codeArr[1] === "identifyNumber") {
        // 证件号码 算年龄
        if (value && value.length === 18) {
          const birth = `${value.substring(6, 10)}-${value.substring(
            10,
            12
          )}-${value.substring(12, 14)}`;
          const date = new Date(birth);
          if (!compare(date, condRule)) NY = true;
        }
      } else if (Array.isArray(value)) {
        if (!compare(value[0], condRule)) NY = true;
      } else if (!compare(value, condRule)) NY = true;
    });
  } else {
    let value = form.getFieldValue(condCode);
    if (Array.isArray(value)) {
      value = value.join(",");
    }
    if (codeArr[1] === "profession") {
      // 职业类别 特殊处理
      if (!compare(value.class, condRule)) NY = true;
    } else if (codeArr[1] === "identifyNumber") {
      if (value && value.length === 18) {
        const birth = `${value.substring(6, 10)}-${value.substring(
          10,
          12
        )}-${value.substring(12, 14)}`;
        const date = new Date(birth);
        if (!compare(date, condRule)) return true;
      }
    } else if (!compare(value, condRule)) return true;
  }
  return NY;
};

const fixedRule = (fixedValue, condCode, form, array) => {
  let NY = false;
  const codeArr = condCode.split(":");
  // condCode：该规则对应的条件字段，如typeRule为1时，数据为app投保信息配置的模块编码和元素编码，如ins_plan:insurance_plan，:前为模块编码，:后为页面元素编码
  // 如typeRule为0时，数据为投保条件编码， ---typeRule 只能为1
  if (codeArr[0] === "insuredTypeModel") {
    array.forEach(dot => {
      let value = form.getFieldValue(`${condCode}_${dot.pageElKey}`);
      if (Array.isArray(value)) {
        value = value.join(",");
      }
      if (fixedValue === value) {
        NY = true;
      }
    });
  } else {
    let value = form.getFieldValue(condCode);
    if (Array.isArray(value)) {
      value = value.join(",");
    }
    if (fixedValue === value) {
      NY = true;
    }
  }
  return NY;
};

const ruleLogic = (condType, condRule, condCode, unvalidMsg, form, array) => {
  const ruleDic = JSON.parse(condRule);
  // condType：该规则对应的值类型，投保规则中应该只用到三种类型 01选项 02区间 03固定文本

  switch (condType) {
    case "01":
      if (pickRule(ruleDic.optionList, condCode, form, array)) {
        return { error: true, rulesMsg: unvalidMsg };
      }
      break;
    case "02":
      if (ratioRule(ruleDic, condCode, form, array)) {
        return { error: true, rulesMsg: unvalidMsg };
      }
      break;
    case "03":
      if (fixedRule(ruleDic.fixedValue, condCode, form, array)) {
        return { error: true, rulesMsg: unvalidMsg };
      }
      break;
    default:
      break;
  }
  return { error: false };
};
// 业务逻辑校验
const rulesMsg = (prodCondRuleDTOs, form, array) => {
  let errorInfo = { error: false };
  prodCondRuleDTOs.forEach(rule => {
    const {
      condType,
      condRule,
      condCode,
      ruleType,
      unvalidMsg,
      relateCondType,
      relateCondRule,
      relateCondCode,
    } = rule;
    const ruleDic = JSON.parse(condRule);
    // condType：该规则对应的值类型，投保规则中应该只用到三种类型 01选项 02区间 03固定文本
    if (ruleType === "1") {
      errorInfo = ruleLogic(
        condType,
        condRule,
        condCode,
        unvalidMsg,
        form,
        array,
      );
    } else if (ruleType === "2") {
      // 2为关联规则
      switch (condType) {
        case "01":
          if (pickRule(ruleDic.optionList, condCode, form, array)) {
            errorInfo = ruleLogic(
              relateCondType,
              relateCondRule,
              relateCondCode,
              unvalidMsg,
              form,
              array
              ,
            );
          }
          break;
        case "02":
          if (ratioRule(ruleDic, condCode, form, array)) {
            errorInfo = ruleLogic(
              relateCondType,
              relateCondRule,
              relateCondCode,
              unvalidMsg,
              form,
              array,
            );
          }
          break;
        case "03":
          if (fixedRule(ruleDic.fixedValue, condCode, form, array)) {
            errorInfo = ruleLogic(
              relateCondType,
              relateCondRule,
              relateCondCode,
              unvalidMsg,
              form,
              array,
            );
          }
          break;
        default:
          break;
      }
    }
  });

  return errorInfo;
};

export { rulesMsg };
