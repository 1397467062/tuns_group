import React from "react";
import { connect } from "dva";
import { Toast } from "antd-mobile";
import FormDrawer from "tuns-mobile/lib/form/drawer";
import FormDrawerSelect from "tuns-mobile/lib/form/drawer/select";
import Button from "tuns-mobile/lib/button";
import FormInput from "tuns-mobile/lib/form/input";
import CreatePerson from "./createperson";
import PersonList from "./personlist";
import styles from "./persontype.less";
import { stringNumber } from "../../models";
import { ProfessionAmountRule } from "../../../../insrules/professionamountrule";

@connect(store => ({
  professions: store.proposalSaveSpace.professions,
  productInfo: store.proposalSaveSpace.productInfo,
  proposalSaveInfo: store.proposalSaveSpace.proposalSaveInfo,
}))
class PersonType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreate: false,
      showList: true,
    };
  }

  onSavePerson = newPerson => {
    const {
      itemData,
      proposalSaveInfo,
      form,
      elementIndex,
      dispatch,
    } = this.props;
    const { insureds } = itemData;
    // 重复校验
    const newIdentityNumber = newPerson.identityNumber;
    const newIdentityType = newPerson.identityType[0];
    const { plans } = proposalSaveInfo;
    for (
      let planIndex = 0, { length } = plans;
      planIndex < length;
      planIndex += 1
    ) {
      const planItem = plans[planIndex];
      const { professions } = planItem;
      for (
        let professionIndex = 0, professionLength = professions.length;
        professionIndex < professionLength;
        professionIndex += 1
      ) {
        const professionItem = professions[professionIndex];
        const professionInsureds = professionItem.insureds;
        for (
          let insuredIndex = 0,
            professionInsuredLength = professionInsureds.length;
          insuredIndex < professionInsuredLength;
          insuredIndex += 1
        ) {
          const insuredItem = professionInsureds[insuredIndex];
          const { identityNumber } = insuredItem;
          const identityType = insuredItem.identityType[0];
          if (
            identityNumber === newIdentityNumber &&
            identityType === newIdentityType
          ) {
            const message = `与保障计划${
              stringNumber[planIndex + 1]
            }中第${professionIndex + 1}类职业第${insuredIndex + 1}位被保人重复`;
            Toast.fail(message);
            return;
          }
        }
      }
    }
    insureds.push(newPerson);
    const values = {};
    values[`insuredCount__${elementIndex}`] = `${insureds.length}`;
    form.setFieldsValue(values);
    this.setState(
      {
        showCreate: false,
        showList: true,
      },
      () => {
        // 保费试算
        dispatch({
          type: "proposalSaveSpace/premiumCaculate",
          payload: { form },
        });
      }
    );
  };

  onRmovePerson = index => {
    const { itemData, elementIndex, form, dispatch } = this.props;
    const { insureds } = itemData;
    insureds.splice(index, 1);
    const values = {};
    values[`insuredCount__${elementIndex}`] = `${insureds.length}`;
    form.setFieldsValue(values);
    this.setState({}, () => {
      // 保费试算
      dispatch({
        type: "proposalSaveSpace/premiumCaculate",
        payload: { form },
      });
    });
  };

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
      proposalSaveInfo,
      elementIndex,
      numberIndex,
      planData,
      itemKindsSupport,
      professionSupport,
      onCaculate,
      planName,
      ...otherProps
    } = this.props;
    const { form } = this.props;
    const { professionCode } = itemData;
    let { insureds } = itemData;
    if (!insureds) {
      insureds = [];
      itemData.insureds = insureds;
    }
    const { showCreate, showList } = this.state;
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
      <>
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
                const { plans } = proposalSaveInfo;
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
                      type: "proposalSaveSpace/premiumCaculate",
                      payload: { form: otherProps.form },
                    });
                    return value.classify
                      ? `${
                          value.classify === "99" ? "拒保" : value.classify
                        }类 ${value.name}`
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
          <FormInput
            {...otherProps}
            title="被保人数"
            name={`insuredCount__${elementIndex}`}
            editable={false}
            defaultValue={`${insureds.length}`}
            rules={[
              {
                pattern: /[1-9]\d*/,
                message: `${planTitle}中第${numberIndex +
                  1}类职业没有添加被保人`,
              },
            ]}
          />
          <div className={styles.infoItem}>
            <p className={styles.infoTitle}>被保人信息</p>
            <div className={styles.infoAction}>
              <Button
                type="primary"
                isShadow={false}
                isActive
                onClick={() => {
                  if (!showCreate) {
                    const maxInsured = 10;
                    Toast.info(
                      `每次录入信息不超过${maxInsured}人`,
                      2,
                      null,
                      false
                    );
                    // if (insureds.length >= maxInsured) {
                    //   Toast.fail(`最多添加${maxInsured}个被保人`);
                    //   return;
                    // }
                  }
                  this.setState({ showCreate: !showCreate });
                }}
              >
                {showCreate ? "取消录入" : "录入信息"}
              </Button>
            </div>
          </div>
          <PersonList
            data={insureds}
            onRmove={this.onRmovePerson}
            showList={{ showList }}
            changeShowList={() => {
              this.setState({ showList: !showList });
            }}
          />
        </div>
        {showCreate ? (
          <CreatePerson {...this.props} onSave={this.onSavePerson} />
        ) : null}
      </>
    );
  }
}

export default PersonType;
