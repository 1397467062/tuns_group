const publicRules = {
  public: {
    // 姓名
    name: {
      rules: [
        {
          min: 2,
          message: "姓名不能少于2个汉字",
        },
        {
          max: 150,
          message: "姓名不能超过150个汉字",
        },
        {
          pattern: /^[a-zA-Z+.?·?a-zA-Z+]{4,150}$|^[\u4e00-\u9fa5\uf900-\ufa2d+·?\u4e00-\u9fa5\uf900-\ufa2d]{2,150}$/,
          message: "姓名必须是中文或者英文",
        },
      ],
    },
    // 公司
    companyName: {
      rules: [
        {
          min: 2,
          message: "单位名称不能少于2个汉字",
        },
        {
          max: 150,
          message: "单位名称不能超过150个汉字",
        },
        {
          pattern: /^[a-zA-Z+.?·?a-zA-Z+]{4,150}$|^[\u4e00-\u9fa5\uf900-\ufa2d+·?\u4e00-\u9fa5\uf900-\ufa2d]{2,150}$/,
          message: "单位名称必须是中文或者英文",
        },
      ],
    },
    // 身份证
    // 只验证18位身份证
    idcard: {
      rules: [
        {
          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
          message: "请输入合法的身份证号码",
        },
        {
          len: 18,
          message: "身份证必须18位",
        },
      ],
    },
    // 手机号码
    phone: {
      rules: [
        {
          pattern: /(^1\d{10}$)|(^0\d{10}$)/,
          message: "请输入合法的联系电话",
        },
        {
          len: 11,
          message: "联系电话必须11位",
        },
      ],
    },
    // 邮箱
    email: {
      rules: [
        {
          pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
          message: "请输入正确的电子邮箱",
        },
        {
          min: 6,
          message: "电子邮箱不能少于6位",
        },
      ],
    },
  },
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

export default publicRules;
