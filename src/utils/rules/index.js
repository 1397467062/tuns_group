import publicRules from "./publicRules";
import customRule from "./customRule";

import compare from "./compare";

/**
 * 获取规则
 * @param {string} ruleName 规则名称 格式：模块:字段
 */
const getRule = ruleName => {
  const names = ruleName.split(":");
  const result = names.reduce(
    (currentRule, name) => {
      if (currentRule[name]) {
        return currentRule[name];
      }
      return { rules: [] };
    },
    { ...publicRules, ...customRule }
  );
  if (typeof result.rules === "string") {
    return getRule(result.rules);
  } else {
    return result;
  }
};

export { getRule, compare };
