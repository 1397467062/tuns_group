import React from "react";
import { connect } from "dva";
import { Toast } from "antd-mobile";
import FormDrawer from "tuns-mobile/lib/form/drawer";
import FormDrawerSelect from "tuns-mobile/lib/form/drawer/select";
import FormStepper from "tuns-mobile/lib/form/stepper";
import styles from "./persontype.less";
import { stringNumber } from "../../models";
import { ProfessionAmountRule } from "../../../../insrules/professionamountrule";

@connect(store => ({
  professions: store.proposalTrialSpace.professions,
  productInfo: store.proposalTrialSpace.productInfo,
  proposalTrialInfo: store.proposalTrialSpace.proposalTrialInfo,
}))
class PersonType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      planTitle,
      title,
      showRemove,
      onRemove,
      itemData,
      dispatch,
      professions,
      productInfo,
      proposalTrialInfo,
      elementIndex,
      numberIndex,
      planData,
      itemKindsSupport,
      professionSupport,
      ...otherProps
    } = this.props;
    const { form } = this.props;
    const { professionCode } = itemData;
    let { insuredCount } = itemData;
    if (!insuredCount || insuredCount === 0) {
      insuredCount = 1;
      itemData.insuredCount = insuredCount;
    }
    const itemKindsSupportTemp = [];
    itemKindsSupport.forEach(item => {
      itemKindsSupportTemp.push(item);
      const subItemKinds = item.itemKinds;
      if (subItemKinds) {
        subItemKinds.forEach(subItem => {
          itemKindsSupportTemp.push(subItem);
        });
      }
    });
    const newSupport = ProfessionAmountRule(
      planData,
      itemKindsSupportTemp,
      professionSupport
    );
    const newProfessionSupport = newSupport.professionSupport;
    return (
      <div className={styles.root}>
        <div className={styles.title}>
          <div className={styles.text}>{title}</div>
          <div className={styles.action}>
            {showRemove ? <a onClick={onRemove}>删除</a> : null}
          </div>
        </div>
        <FormDrawer
          {...this.props}
          name={`profession__${elementIndex}`}
          title="职业"
          defaultValue={professionCode}
          rules={[
            {
              required: true,
              message: `${planTitle}中第${numberIndex +
                1}类职业还未选择，请选择！`,
            },
            (rule, value, callback) => {
              const errors = [];
              if (value.length < 5) {
                errors.push(
                  new Error(
                    `${planTitle}中第${numberIndex +
                      1}类职业还未选择，请选择！`,
                    rule.field
                  )
                );
                callback(errors);
                return;
              }
              let pass = true;
              const { plans } = proposalTrialInfo;
              for (
                let planIndex = 0, planLength = plans.length;
                planIndex < planLength;
                planIndex += 1
              ) {
                if (!pass) {
                  break;
                }
                const planItem = plans[planIndex];
                const professionsSave = planItem.professions;
                for (
                  let professionIndex = 0,
                    professionLength = professionsSave.length;
                  professionIndex < professionLength;
                  professionIndex += 1
                ) {
                  const professionItem = professionsSave[professionIndex];
                  if (
                    numberIndex !== professionIndex &&
                    professionItem.professionCode === value
                  ) {
                    pass = false;
                    const message = `保障计划${
                      stringNumber[planIndex + 1]
                    }中已包含该职业！`;
                    Toast.fail(message, 2);
                    errors.push(new Error(message, rule.field));
                    break;
                  }
                }
              }
              callback(errors);
            },
          ]}
        >
          <FormDrawerSelect
            onChangeDisplay={value => {
              if (value) {
                if (newProfessionSupport.indexOf(value.classify) === -1) {
                  const values = {};
                  values[`profession__${elementIndex}`] = [];
                  form.setFieldsValue(values);
                  itemData.professionId = null;
                  itemData.professionCode = null;
                  itemData.professionClassify = null;
                  itemData.professionName = null;
                } else {
                  itemData.professionId = value.id;
                  itemData.professionCode = value.value;
                  itemData.professionClassify = value.classify;
                  itemData.professionName = value.name;
                  // 保费试算
                  dispatch({
                    type: "proposalTrialSpace/premiumCaculate",
                    payload: { form: otherProps.form },
                  });
                  return value.classify
                    ? `${value.classify === "99" ? "拒保" : value.classify}类 ${
                        value.name
                      }`
                    : "";
                }
              }
            }}
            data={professions}
            errorClose={false}
            customRule={moreItem => {
              const { classify } = moreItem;
              return newProfessionSupport.indexOf(classify) !== -1;
            }}
            more={moreItem => {
              const { classify } = moreItem;
              const isError = newProfessionSupport.indexOf(classify) === -1;
              return `类别：${classify === "99" ? "拒保" : classify}类 （${
                isError ? "不" : ""
              }符合投保条件）`;
            }}
          />
        </FormDrawer>
        <FormStepper
          {...otherProps}
          title="被保人数"
          name={`insuredCount__${elementIndex}`}
          editable={false}
          defaultValue={`${insuredCount}`}
          rules={[
            {
              pattern: /[1-9]\d*/,
              message: `${planTitle}中第${numberIndex + 1}类职业没有添加被保人`,
            },
          ]}
          min={1}
          max={100}
          step="1"
          showNumber
          onSuperChange={value => {
            itemData.insuredCount = value;
            // 保费试算
            dispatch({
              type: "proposalTrialSpace/premiumCaculate",
              payload: { form: otherProps.form },
            });
          }}
        />
      </div>
    );
  }
}

export default PersonType;
