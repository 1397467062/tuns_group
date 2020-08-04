import publicRules from "../../utils/rules/publicRules";

const groupInfo = [
  {
    type: "header",
    title: "团体信息",
  },
  {
    type: "input",
    title: "投保单位",
    name: "insureCompany",
    value: "",
    placeholder: "请填写投保单位名称",
    rules: publicRules.public.companyName.rules,
  },
  {
    type: "pick",
    title: "证件类型",
    name: "identificationType",
    value: "",
    placeholder: "请选择证件类型",
    data: [
      { value: "09", label: "组织机构代码证" },
      { value: "19", label: "统一社会信用代码" },
    ],
  },
  {
    type: "file",
    title: "照片/图片",
    name: "identificationUrl",
    value: "",
    placeholder: "请选择证件图片",
  },
  {
    type: "header",
    title: "联系人信息",
  },
  {
    type: "input",
    title: "企业联系人",
    name: "contactsName",
    value: "",
    placeholder: "请填写联系人姓名",
    rules: publicRules.public.name.rules,
  },
  {
    type: "input",
    title: "联系人电话",
    name: "contactsPhone",
    value: "",
    placeholder: "请填写联系人手机号码",
    rules: publicRules.public.phone.rules,
  },
  {
    type: "input",
    title: "联系人邮箱",
    name: "contactsEmail",
    value: "",
    placeholder: "用于接收电子保单",
    rules: publicRules.public.email.rules,
  },
];

export { groupInfo };
