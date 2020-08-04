/**
 * 转换后台返回职业数据为前端抽屉组件需要的数据类型
 * @param {array} data 后台返回职业数据
 */
const parseProfession = data =>
  data.map(item => {
    const res = {
      id: item.code,
      value: item.code,
      name: item.name,
      classify: item.classify,
    };
    if (Array.isArray(item.options) && item.options.length > 0) {
      res.children = parseProfession(item.options);
    }
    return res;
  });

const containerAction = (action, option = "{}") => {
  try {
    if (window.webkit) {
      const IOSRouterAction =
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.TunsAppAction;
      if (IOSRouterAction) {
        IOSRouterAction.postMessage([action, option]);
      } else if (window.webkit.TunsAppAction) {
        window.webkit.TunsAppAction(action, option);
      }
    }
  } catch (err) {
    // error
  }
};

const getRunEnv = () => {
  return process.env.yeo_env;
};

/**
 * 身份证校验
 * @param idCard 证件号码
 * @returns {Boolean}
 */
const validateIdCard = idCard => {
  // 15位和18位身份证号码的正则表达式
  const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  // 如果通过该验证，说明身份证格式正确，但准确性还需计算
  if (regIdCard.test(idCard)) {
    if (idCard.length === 18) {
      const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 将前17位加权因子保存在数组里
      const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
      let idCardWiSum = 0; // 用来保存前17位各自以加权因子后的总和
      for (let i = 0; i < 17; i += 1) {
        idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
      }
      const idCardMod = idCardWiSum % 11; // 计算出校验码所在数组的位置
      const idCardLast = idCard.substring(17); // 得到最后一位身份证号码
      // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod === 2) {
        if (idCardLast === "X" || idCardLast === "x") {
          return true;
        } else {
          return false;
        }
      } else {
        // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        return idCardLast === `${idCardY[idCardMod]}`;
      }
    }
  } else {
    return false;
  }
};

/**
 * 从身份证读取时间
 * @param {String} idCard 证件号码
 * @param {Boolean} pass 是否已验证证件
 * @returns {Date}
 */
const dateFromIdCard = (idCard, pass = false) => {
  if (pass || validateIdCard(idCard)) {
    const year = idCard.substring(6, 10);
    const month = idCard.substring(10, 12);
    const day = idCard.substring(12, 14);
    return new Date(year, month - 1, day);
  } else {
    return null;
  }
};

/**
 * 从身份证读取性别
 * @param {String} idCard 证件号码
 * @param {Boolean} pass 是否已验证证件
 * @returns {String}
 */
const sexFromIdCard = (idCard, pass = false) => {
  if (pass || validateIdCard(idCard)) {
    const temp = idCard.substring(16, 17);
    return temp % 2 === 0 ? "2" : "1";
  } else {
    return null;
  }
};

export {
  parseProfession,
  containerAction,
  getRunEnv,
  validateIdCard,
  dateFromIdCard,
  sexFromIdCard,
};
