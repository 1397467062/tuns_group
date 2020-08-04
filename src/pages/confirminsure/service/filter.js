// 行业性质
const companyType = {
  "01": "私营企业",
  "02": "国营企业",
};

// 证件类型
const credentials = {
  "01": "身份证",
  "02": "户口本",
  "03": "出生证",
  "04": "出生日期(新生婴儿)",
  "05": "护照",
  "06": "军官证",
  "07": "驾驶执照",
  "08": "回乡证",
  "09": "组织机构代码",
  "10": "士兵证",
  "11": "临时身份证",
  "12": "警官证",
  "13": "学生证",
  "14": "军官离退休证",
  "15": "港澳通行证",
  "16": "台湾通行证",
  "17": "旅行证",
  "18": "外国人永久居留身份证",
  "19": "统一社会信用代码",
  "99": "其它",
};

const insureTimeToTitle = string => {
  let title = string;
  if (title) {
    title = title.replace(/y/g, "年");
    title = title.replace(/m/g, "个月");
    title = title.replace(/d/g, "天");
  }
  return title;
};
// 订单状态(G1-等待支付,G2-支付成功,G3-支付失败,G4-支付失效,G5-承保成功,G6-承保失败,G7-等待承保)
export const baseinfo = data => {
  const object = {};
  object.state = 0;
  // 0-等待支付,1-支付成功,2-支付失败 3订单关闭
  if (data.orderStatus === "G2") {
    object.state = 1;
  } else if (data.orderStatus === "G3") {
    object.state = 2;
  } else if (data.orderStatus === "G4") {
    object.state = 3;
  }
  object.premAmount = parseFloat(data.premAmount || 0).toFixed(2);
  return object;
};

export const plansData = data => {
  const { plans = [] } = data;
  const guaran = [];
  if (plans) {
    plans.forEach(plan => {
      const safeguard = {};
      const { guarantees = [], occupations } = plan;
      safeguard.guarantees = [];
      guarantees.forEach(item => {
        safeguard.guarantees.push({
          id: item.guaranteeId,
          title: item.riskLiabTypeName,
          value: item.premDesc,
        });
      });
      safeguard.occupations = [];
      occupations.forEach((item, index) => {
        const obj = {};
        obj.title = `被保险人信息${index + 1}`;
        obj.info = [
          {
            id: item.occupationCode,
            title: "职业类型",
            value: `${item.occupationName}-${item.occupationCode}类`,
          },
          {
            id: item.occupationId,
            title: "被保人人数",
            value: `${item.insureNumber}人`,
          },
        ];
        obj.person = [];
        item.insurers.forEach((insurer, ii) => {
          obj.person.push({
            id: insurer.id,
            title: `${ii + 1}.${insurer.insuredName}`,
            typestr: credentials[insurer.identificationType],
            number: insurer.identificationNo,
          });
        });
        safeguard.occupations.push(obj);
      });

      guaran.push(safeguard);
    });
  }
  return guaran;
};

export const trimOrdersDetailData = data => {
  const { appBasic = {}, policyHolder = {} } = data;

  const holderInfo = [];
  const contacterInfo = [];
  const holderInfoTitle = [
    "投保单位",
    "单位性质",
    "证件类型",
    "证件号码",
    "证件图片",
    "办公地址",
  ];
  const {
    insureCompany,
    industryNature,
    identificationType,
    identificationNo,
    identificationUrl,
    contactsName,
    contactsPhone,
    contactsEmail,
    companyAddress,
  } = policyHolder;
  const holderInfoValue = [
    insureCompany,
    companyType[industryNature] || "私营企业",
    credentials[identificationType] || "证件类型",
    identificationNo,
    identificationUrl,
    companyAddress,
  ];

  holderInfoTitle.forEach((title, index) => {
    holderInfo.push({
      title,
      ...(title === "证件图片"
        ? {
            type: "img",
            value: holderInfoValue[index]
              ? JSON.parse(holderInfoValue[index])
              : "",
            hideTitle: true,
          }
        : { value: holderInfoValue[index], hideTitle: true }),
    });
  });

  const contacterInfoTitle = ["企业联系人", "联系人电话", "联系人邮箱"];
  const contacterInfoValue = [contactsName, contactsPhone, contactsEmail];
  contacterInfoTitle.forEach((title, index) => {
    contacterInfo.push({
      title,
      value: contacterInfoValue[index],
    });
  });
  return {
    listData: [
      {
        id: "001",
        title: "订单详情",
        list: [
          {
            id: "001001",
            title: "订单状态",
            value: "待付款",
          },
          {
            id: "001002",
            title: "产品名称",
            data: [
              {
                id: "001002001",
                title: data.productName,
                path: `/detail?productCode=${data.productId}`,
              },
            ],
            type: "link",
          },
          {
            id: "001003",
            title: "保障计划",
            value: appBasic.planName,
          },
          {
            id: "001004",
            title: "保障期限",
            value: insureTimeToTitle(appBasic.insureTime),
            hideTitle: true,
          },
          {
            id: "001005",
            title: "保障年龄",
            value: appBasic.insureAge,
            hideTitle: true,
          },
          {
            id: "001006",
            title: "起保日期",
            value: appBasic.startDate,
          },
          {
            id: "001007",
            title: "终止日期",
            value: appBasic.endDate,
          },
          {
            id: "001008",
            title: "合计保费",
            value: `${parseFloat(appBasic.premAmount || 0).toFixed(2)}元`,
          },
        ],
      },
      {
        id: "002",
        title: "投保人信息",
        list: holderInfo.map((key, index) => ({
          id: `002${index}`,
          ...key,
        })),
      },
      {
        id: "003",
        title: "联系人信息",
        list: contacterInfo.map((key, index) => ({
          id: `003${index}`,
          ...key,
        })),
      },
      {
        id: `004`,
        title: "受益人信息",
        list: [
          {
            id: `00401`,
            title: "受益人",
            value: "法定受益人",
          },
        ],
      },
    ],
  };
};
