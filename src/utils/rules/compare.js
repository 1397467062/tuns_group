import moment from "moment";

const rulesObj = {
  gt: (a, b) => a > b,
  ge: (a, b) => a >= b,
  lt: (a, b) => a < b,
  le: (a, b) => a <= b,
  eq: (a, b) => a === b,
};

const dateUnitObj = {
  H: "hours",
  D: "days",
  M: "months",
  Y: "years",
};

// 转换后台传递过来的自定义规则
// 约定只有 时间逻辑 跟 数字逻辑
// 约定会有 begin|end 边界
const converRule = (rules, option) => {
  const ruleObject = {
    rules: [],
    type: rules.beginOper === "lt" || rules.beginOper === "le" ? "out" : "in",
  };
  // const rulesArr = [];
  ruleObject.rules.push(value => {
    // 默认数字逻辑
    let diff = value;
    // 通过是否有单位来判断是否走时间逻辑
    if (rules.beginUnit) {
      diff = moment(option.date || new Date()).diff(
        moment(value),
        dateUnitObj[rules.beginUnit]
      );
    }
    return rulesObj[rules.beginOper](diff, parseInt(rules.beginVal, 10));
  });

  ruleObject.rules.push(value => {
    // 默认数字逻辑
    let diff = value;
    // 通过是否有单位来判断是否走时间逻辑
    if (rules.endUnit) {
      diff = moment(option.date || new Date()).diff(
        moment(value),
        dateUnitObj[rules.endUnit]
      );
    }
    return rulesObj[rules.endOper](diff, parseInt(rules.endVal, 10));
  });

  return ruleObject;
};

/**
 * @param {(date|string)} v 对比值
 * @param {object} rulesJSON 规则
 * @param {object} option 选项
 * @param {date} option.date 对比时间，默认为当前时间
 */
const compare = (v, rules, option = {}) => {
  const result = converRule(rules, option);
  if (result.type === "in") {
    return result.rules.some(rule => !rule(v));
  } else if (result.type === "out") {
    return result.rules.every(rule => !rule(v));
  }
};

export default compare;
