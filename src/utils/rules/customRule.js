const customRules = {
  // 投保人信息
  holderInfo: {
    personName: {
      rules: "public:name",
    },
    identifyNumber: {
      rules: "public:idcard",
    },
    mobilePhone: {
      rules: "public:phone",
    },
    email: {
      rules: "public:email",
    },
  },
  // 被投保人
  insuredInfo: {
    personName: {
      rules: "public:name",
    },
    identifyNumber: {
      rules: "public:idcard",
    },
    mobilePhone: {
      rules: "public:phone",
    },
    email: {
      rules: "public:email",
    },
  },
};

export default customRules;
