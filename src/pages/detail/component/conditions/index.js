import React from "react";
import Form from "tuns-mobile/lib/form";
import TeamPicker from "tuns-mobile/lib/form/teampick";
import FormModalSelect from "tuns-mobile/lib/form/modal/select";
import FormAccordion from "tuns-mobile/lib/form/accordion";
import { Toast } from "antd-mobile";
import Option from "./option";
import Tabs from "../tabs";
import Footer from "../footer";
import { MP18200127 as itemKindCheck } from "./config";

import styles from "./index.less";

class Conditions extends React.Component {
  savePremiumInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "detail/premiumTrial",
      payload: { planForm: this.planForm, liabForm: this.liabForm },
    });
  };

  onRestAmount = () => {
    const { info } = this.props;
    const { liab } = info;
    const { form } = this.liabForm.props;
    liab.forEach(item => {
      form.setFieldsValue({ [item.name]: item.data[0].value });
    });
  };

  onRestValue = name => {
    const values = {};
    values[name] = [];
    const { form } = this.planForm.props;
    form.setFieldsValue(values);
  };

  getFormValues = () => {
    const { dispatch } = this.props;
    const { form: liabForm } = this.liabForm.props;
    const { form: planForm } = this.planForm.props;
    const liabValues = liabForm.getFieldsValue();
    const planValues = planForm.getFieldsValue();
    dispatch({
      type: "detail/saveFormInfo",
      payload: { liabValues, planValues },
    });
  };

  submitRender = (notice, form) => {
    const { dispatch, info } = this.props;
    const { detailInfo, premium } = info;
    const { productId } = detailInfo;
    return (
      <Footer
        form={form}
        notice={notice}
        dispatch={dispatch}
        code={detailInfo.exhibitionModeCode}
        premium={premium}
        productCode={productId}
        getFormValues={this.getFormValues.bind(this)}
      />
    );
  };

  picker = (change, prof) => {
    if (prof) {
      change();
    } else {
      Toast.info("请先选择职业");
    }
  };

  itemKindCheckHandle = (change, prof, code) => {
    if (!prof) {
      Toast.info("请先选择职业");
    } else if (!itemKindCheck[code].choice) {
      Toast.info("保障责任为组合套餐，无法单独购买");
    } else {
      change();
    }
  };

  // 对应更改关联的保额
  itemKindCheckValue = (value, liab, data) => {
    const { form } = this.liabForm.props;
    liab.forEach((item, index) => {
      if (item.value === value) {
        data.forEach(liabItem => {
          if (itemKindCheck[liabItem.code]) {
            form.setFields({ [liabItem.code]: liabItem.data[index] });
          }
        });
      }
    });
  };

  // 非勾选保障权益下的权益渲染
  renderOption = data => {
    const { info } = this.props;
    const { checkedProf } = info;
    return data.map(item => {
      if (item.type === "0") {
        let value = { liabId: item.liabId, amount: item.text };
        value = JSON.stringify(value);
        if (item.detailValue) {
          return (
            <FormAccordion
              key={item.name}
              name={item.name}
              data={[
                {
                  id: item.id,
                  title: item.title,
                  content: item.detailValue,
                  value,
                  money: item.text,
                },
              ]}
              defaultValue={value}
            />
          );
        } else {
          return (
            <FormAccordion
              key={item.liabId}
              name={item.name}
              data={[
                {
                  id: item.id,
                  title: item.title,
                  content: item.detailValue,
                  value,
                  money: item.text,
                },
              ]}
              defaultValue={value}
              show={false}
            />
          );
        }
      } else if (item.type === "1") {
        return (
          <TeamPicker
            key={item.id}
            name={item.name}
            title={item.title}
            detailValue={item.detailValue}
            defaultValue={item.data[0].value}
            rules={[
              {
                required: true,
                message: "请选择保额",
              },
            ]}
            onSuperChange={(from, value, change) => {
              if (itemKindCheck[item.code]) {
                // 平安团意险 组合处理
                this.itemKindCheckHandle(change, checkedProf, item.code);
              } else {
                this.picker(change, checkedProf);
              }
            }}
          >
            <FormModalSelect
              title={item.title}
              data={item.data}
              onSuperChange={value => {
                if (itemKindCheck[item.code]) {
                  // 平安团意险 value处理
                  this.itemKindCheckValue(value, item.data, data);
                }
                this.savePremiumInfo();
              }}
            />
          </TeamPicker>
        );
      } else {
        return <></>;
      }
    });
  };

  render() {
    const { info, dispatch, profession } = this.props;
    const {
      tabs,
      detailInfo,
      condeType,
      images,
      checkedProf,
      project,
      liab,
      profAmountLiab,
    } = info;
    let { groupLiab } = info;
    const {
      productId,
      premiumTrialFlag,
      groupNoticeDTO,
      groupAppointItemDTOList: appoint = [],
    } = detailInfo;
    const params = {
      dispatch,
      premiumTrialFlag,
      profession,
      checkedProf,
      project,
    };
    const singleLiab = groupLiab.filter(item => item.data.length === 1);
    groupLiab = groupLiab.filter(item => item.data.length > 1);
    return (
      <div className={styles.root}>
        <div className={styles.title}>保障方案</div>
        <div className={styles.condeBox}>
          <Form
            submitRender={this.submitRender.bind(this, groupNoticeDTO)}
            wrappedComponentRef={form => {
              if (form) {
                this.planForm = form;
              }
            }}
          >
            {condeType.map(item => {
              return Option(
                item,
                { ...params },
                productId,
                this.savePremiumInfo,
                this.onRestAmount,
                this.onRestValue,
                this.getFormValues
              );
            })}
          </Form>
        </div>
        <div className={styles.liabBox}>
          <div className={styles.title}>保障权益</div>
          <Form
            wrappedComponentRef={form => {
              if (form) {
                this.liabForm = form;
              }
            }}
          >
            {profAmountLiab.length > 0
              ? this.renderOption(profAmountLiab)
              : this.renderOption(liab)}
            {singleLiab.length > 0 ? this.renderOption(singleLiab) : <></>}
            {groupLiab.length > 0 ? (
              <FormAccordion
                key="accordion"
                name="group"
                check
                group
                data={groupLiab}
                rules={[
                  {
                    required: true,
                    message: "请选择组合保险权益",
                  },
                ]}
                defaultValue=""
                onSuperChange={() => {
                  this.savePremiumInfo();
                }}
              />
            ) : (
              <></>
            )}
            {appoint.map(item => (
              <div className={styles.appoint}>
                <span>{item.itemCode}</span>
                <span>{item.itemNotice}</span>
              </div>
            ))}
          </Form>
        </div>

        <Tabs tab={tabs} img={images} />
      </div>
    );
  }
}

export default Conditions;
