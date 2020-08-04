import React from "react";
import { connect } from "dva";
import { Modal, ActionSheet } from "antd-mobile";
import Form from "tuns-mobile/lib/form";
import Group from "tuns-mobile/lib/form/group";
import Input from "tuns-mobile/lib/form/input";
import Picker from "tuns-mobile/lib/form/picker";
import Upload from "tuns-mobile/lib/form/upload";
import CheckboxGroup from "tuns-mobile/lib/form/checkboxgroup";
import Agreement from "tuns-mobile/lib/agreement";
import { storage, equals } from "tuns-utils";
import { getRule } from "utils/rules";
import Stepper from "tuns-mobile/lib/form/stepper";
import ModalContent from "../modalcontent";
import styles from "./index.less";

const industriesOption = [
  [
    {
      value: "industry_01",
      label: "零售业",
    },
    {
      value: "industry_02",
      label: "餐饮业",
    },
    {
      value: "industry_03",
      label: "服务业",
    },
    {
      value: "industry_04",
      label: "其他",
    },
  ],
];

const enterpriseNatureOption = [
  [
    {
      value: "01",
      label: "私营",
    },
    {
      value: "02",
      label: "国企",
    },
  ],
];

const identityTypeOption = [
  [
    {
      value: "09",
      label: "组织机构代码证",
    },
    {
      value: "21",
      label: "税务登记证",
    },
    {
      value: "22",
      label: "营业执照",
    },
    {
      value: "19",
      label: "统一社会信用代码",
    },
  ],
];

@connect(store => ({
  productInfo: store.proposalSaveSpace.productInfo,
  proposalSaveInfo: store.proposalSaveSpace.proposalSaveInfo,
}))
class InfoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { needInvoice: true, visible: false };
  }

  componentDidUpdate(prevProps) {
    const { proposalSaveInfo } = this.props;
    if (!equals(proposalSaveInfo, prevProps.proposalSaveInfo)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        needInvoice: proposalSaveInfo.policyHolder.invoiceType === "1",
      });
    }
  }

  // 《产品条款》 弹框
  ontermsList = () => {
    const { productInfo2, storageAction } = this.props;
    const { productLiabilitys } = productInfo2;
    const buttons = [];
    const urls = [];
    productLiabilitys.forEach(item => {
      buttons.push(item.name);
      urls.push(item.url);
    });
    ActionSheet.showActionSheetWithOptions(
      {
        options: buttons,
        title: "产品条款",
        maskClosable: true,
        "data-seed": "logId",
      },
      buttonIndex => {
        if (urls[buttonIndex]) {
          // 缓存数据
          storageAction(() => {
            window.location.href = urls[buttonIndex];
          });
        }
      }
    );
  };

  // 《投保须知》弹框

  onToggleVisible = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  renderItems = key => {
    const { productInfo } = this.props;
    const parameters = Object.prototype.hasOwnProperty.call(productInfo, key)
      ? productInfo[key]
      : [];
    return parameters.map(item => this.renderItem(item));
  };

  renderItem = item => {
    const {
      // code,
      key,
      title,
      // text,
      type,
      must,
      tips,
      // affectedPremium,
      show,
      // defaultValue,
      minValue,
      // intervalValue,
      maxValue,
      options,
    } = item;
    let { defaultValue } = item;
    const { proposalSaveInfo } = this.props;
    const { policyHolder } = proposalSaveInfo;
    defaultValue = policyHolder[key] ? policyHolder[key] : defaultValue;
    switch (type) {
      case "01":
        return (
          <Picker
            key={key}
            title={title}
            name={key}
            cascade
            cols={1}
            isHide={show === "0"}
            data={options}
            defaultValue={[defaultValue]}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            placeholder={tips}
          />
        );
      case "02":
        return (
          <Input
            key={key + title}
            title={title}
            name={key}
            editable={false}
            value={defaultValue}
            defaultValue={defaultValue}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            isHide={show === "0"}
            placeholder={tips}
          />
        );
      case "03":
        return (
          <Input
            key={key + title}
            title={title}
            name={key}
            editable
            value={defaultValue}
            defaultValue={defaultValue}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            isHide={show === "0"}
            placeholder={tips}
          />
        );
      case "04":
        return (
          <Input
            key={key}
            title={title}
            name={key}
            editable={false}
            value={defaultValue}
            defaultValue={defaultValue}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            isHide={show === "0"}
            placeholder={tips}
          />
        );
      case "06": {
        return (
          <Input
            key={key}
            title={title}
            name={key}
            editable={false}
            value={defaultValue}
            defaultValue={defaultValue}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            isHide={show === "0"}
            placeholder={tips}
          />
        );
      }
      case "10": {
        return (
          <Stepper
            key={key}
            title={title}
            name={key}
            defaultValue={1}
            isHide={show === "0"}
            min={minValue}
            max={maxValue}
            step="1"
            showNumber
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            placeholder={tips}
          />
        );
      }
      case "12": {
        return (
          <Upload
            key={key}
            title={title}
            name={key}
            isHide={show === "0"}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            businessType="group"
            businessNumber="group"
            token={storage.get("token")}
          />
        );
      }
      default:
        return (
          <Input
            key={key}
            title={title}
            name={key}
            editable={false}
            value={defaultValue}
            defaultValue={defaultValue}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            isHide={show === "0"}
            placeholder={tips}
          />
        );
    }
  };

  render() {
    const { needInvoice, visible } = this.state;
    const {
      getForm,
      onChangeAgreement,
      productInfo2,
      proposalSaveInfo,
    } = this.props;
    let { policyHolder } = proposalSaveInfo;
    if (!policyHolder) {
      policyHolder = {};
      proposalSaveInfo.policyHolder = policyHolder;
    }

    const instructions = productInfo2.instructions || [];
    let instructionText = "";
    if (instructions.length > 0) {
      const [instruction] = instructions;
      instructionText = instruction.instruction;
    }
    const policyHolderParameters = [
      <Input
        key="companyName_"
        title="投保单位"
        placeholder="请填写投保单位名称"
        name="companyName"
        defaultValue={policyHolder.companyName}
        rules={[
          {
            required: true,
            message: "请填写投保单位名称",
          },
        ]}
        onSuperChange={value => {
          if (needInvoice) {
            this.form.setFieldsValue({ invoiceTitle: value });
          }
        }}
      />,
      <Picker
        key="industries_"
        title="所属行业"
        extra="请选择所属行业"
        name="industries"
        data={industriesOption}
        defaultValue={policyHolder.industries ? [policyHolder.industries] : []}
        rules={[
          {
            required: false,
            message: "请选择所属行业",
          },
        ]}
      />,
      <Picker
        key="enterpriseNature_"
        title="单位性质"
        extra="请选择单位性质"
        name="enterpriseNature"
        data={enterpriseNatureOption}
        defaultValue={
          policyHolder.enterpriseNature ? [policyHolder.enterpriseNature] : []
        }
        rules={[
          {
            required: false,
            message: "请选择单位性质",
          },
        ]}
      />,
      <Picker
        key="identityType_"
        title="证件类型"
        extra="请选择证件类型"
        name="identityType"
        data={identityTypeOption}
        defaultValue={
          policyHolder.identityType ? [policyHolder.identityType] : []
        }
        rules={[
          {
            required: true,
            message: "请选择证件类型",
          },
        ]}
      />,
      <Input
        key="identityNumber_"
        title="证件号码"
        placeholder="请填写证件类型对应的证件号码"
        name="identityNumber"
        defaultValue={policyHolder.identityNumber}
        rules={[
          {
            required: true,
            message: "请填写证件类型对应的证件号码",
          },
        ]}
      />,
      <Upload
        key="identityImages_"
        name="identityImages"
        defaultValue={policyHolder.identityImages}
        rules={[
          {
            required: false,
            message: "请上传照片/图片",
          },
        ]}
        title="照片/图片"
        businessType="group"
        businessNumber="group"
        token={storage.get("token")}
      />,
      <Input
        key="companyAddress_"
        title="办公地址"
        placeholder="请填写办公详细地址"
        name="companyAddress"
        defaultValue={policyHolder.companyAddress}
        rules={[
          {
            required: false,
            message: "请填写办公详细地址",
          },
        ]}
      />,
    ];

    const policyHolderContactParameters = [
      <Input
        key="contactName_"
        title="企业联系人"
        placeholder="请填写联系人姓名"
        name="contactName"
        defaultValue={policyHolder.contactName}
        rules={[
          ...getRule("public:name").rules,
          {
            required: false,
            message: "请填写联系人姓名",
          },
        ]}
      />,
      <Input
        key="contactPhone_"
        title="联系人电话"
        placeholder="请填写联系人手机号码"
        name="contactPhone"
        defaultValue={policyHolder.contactPhone}
        rules={[
          ...getRule("public:phone").rules,
          {
            required: true,
            message: "请填写联系人手机号",
          },
        ]}
      />,
      <Input
        key="contactEmail_"
        title="联系人邮箱"
        placeholder="用于接收电子保单"
        name="contactEmail"
        defaultValue={policyHolder.contactEmail}
        rules={[
          ...getRule("public:email").rules,
          {
            required: true,
            message: "请填写联系人邮箱",
          },
        ]}
      />,
    ];

    return (
      <div className={styles.root}>
        <Form
          wrappedComponentRef={ref => {
            if (ref) {
              this.form = ref.props.form;
            } else {
              this.form = null;
            }
            if (getForm) {
              getForm(this.form);
            }
          }}
        >
          <Group title="投保人信息" classname={styles.group}>
            {[
              ...policyHolderParameters,
              ...this.renderItems("policyHolderParameters"),
            ]}
          </Group>
          <Group title="联系人信息" classname={styles.group}>
            {[
              ...policyHolderContactParameters,
              ...this.renderItems("policyHolderContactParameters"),
            ]}
          </Group>
          <Group
            title={
              <div className={styles.groupTitle}>
                <div className={styles.text}>发票信息</div>
                <div className={styles.more}>如需更改，请联系保险公司</div>
              </div>
            }
            classname={styles.group}
          >
            <CheckboxGroup
              name="invoiceType"
              title={<div className={styles.invoice}>发票类型</div>}
              options={[
                { value: "0", label: "不需要" },
                { value: "1", label: "增值税电子发票" },
              ]}
              defaultValue={
                policyHolder.invoiceType && policyHolder.invoiceType.length
                  ? [policyHolder.invoiceType]
                  : []
              }
              onChange={() => {}}
              disabled={false}
              editable
              multiple={false}
              flip={false}
              rules={[
                (rule, value, callback) => {
                  const errors = [];
                  if (value.length === 0) {
                    errors.push(new Error(`请选择发票类型`, rule.field));
                  }
                  callback(errors);
                },
              ]}
              onSuperChange={value => {
                this.setState({
                  needInvoice: value.length > 0 && value[0] !== "0",
                });
              }}
            />

            {needInvoice ? (
              <Input
                title="发票抬头"
                placeholder="请输入发票抬头"
                name="invoiceTitle"
                defaultValue={policyHolder.invoiceTitle}
                rules={
                  needInvoice
                    ? [
                        {
                          required: true,
                          message: "请填写发票抬头",
                        },
                      ]
                    : null
                }
              />
            ) : (
              <></>
            )}
            {needInvoice ? (
              <Input
                title="证件号码"
                placeholder="纳税人识别号码或统一社会信用代码"
                name="invoiceIdentityNumber"
                defaultValue={policyHolder.invoiceIdentityNumber}
                rules={
                  needInvoice
                    ? [
                        {
                          required: true,
                          message: "请填写发票证件号码",
                        },
                      ]
                    : null
                }
              />
            ) : (
              <></>
            )}
            {needInvoice ? (
              <Input
                title="电子邮箱"
                placeholder="用于接收电子发票"
                name="invoiceEmail"
                defaultValue={policyHolder.invoiceEmail}
                rules={
                  needInvoice
                    ? [
                        ...getRule("public:email").rules,
                        {
                          required: true,
                          message: "请填写接收电子发票邮箱",
                        },
                      ]
                    : null
                }
              />
            ) : (
              <></>
            )}
          </Group>

          <Group title="受益人信息" classname={styles.group}>
            <Input
              title="受益人"
              placeholder="法定受益人"
              name="beneficiary"
              defaultValue="法定受益人"
              editable={false}
            />
          </Group>
          <Agreement
            onChange={value => {
              if (onChangeAgreement) {
                onChangeAgreement(value);
              }
            }}
            text="本人承诺投保信息的真实性，已认真阅读 《投保须知》 《产品条款》 并同意上述协议约定。"
            eventText={{
              "《投保须知》": () => {
                this.onToggleVisible();
              },
              "《产品条款》": () => {
                this.ontermsList();
              },
            }}
          />
        </Form>
        <Modal
          popup
          animationType="slide-up"
          visible={visible}
          onClose={this.onToggleVisible}
        >
          <ModalContent
            onClose={this.onToggleVisible}
            title="投保须知"
            content={instructionText}
          />
        </Modal>
      </div>
    );
  }
}

export default InfoComponent;
