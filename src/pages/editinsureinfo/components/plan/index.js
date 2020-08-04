import React from "react";
import { Icon, Toast } from "antd-mobile";
import { connect } from "dva";
import Button from "tuns-mobile/lib/button";
import Form from "tuns-mobile/lib/form";
import FormPicker from "tuns-mobile/lib/form/picker";
import FormDatePicker from "tuns-mobile/lib/form/datepicker";
import FormInput from "tuns-mobile/lib/form/input";
import FormStepper from "tuns-mobile/lib/form/stepper";
import moment from "moment";
import CreatePlan from "../createplan";
import styles from "./index.less";
import { stringNumber } from "../../models";

@connect(store => ({
  productInfo: store.proposalSaveSpace.productInfo,
  productInfo2: store.proposalSaveSpace.productInfo2,
  proposalSaveInfo: store.proposalSaveSpace.proposalSaveInfo,
}))
class PlanComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    this.calculateInsuranceEnd();
  }

  onRemovePlan = key => {
    const { dispatch } = this.props;
    dispatch({ type: "proposalSaveSpace/removePlan", payload: key }).then(
      () => {
        // 保费试算
        dispatch({
          type: "proposalSaveSpace/premiumCaculate",
          payload: { form: this.form },
        });
      }
    );

    // savePlanList(planList.filter(item => item.key !== key));
  };

  onAddPlan = () => {
    const { proposalSaveInfo, dispatch } = this.props;
    const { plans } = proposalSaveInfo;

    const maxPlan = stringNumber.length - 1;
    if (plans.length >= maxPlan) {
      Toast.fail(`保障计划最多添加${maxPlan}个`);
      return;
    }

    dispatch({ type: "proposalSaveSpace/addPlan" });
  };

  calculateDateTime = (initDate, params) => {
    let YAdd = 0;
    let MAdd = 0;
    let DAdd = 0;
    let HAdd = 0;
    const paramList = params.split(",");
    paramList.forEach((item, index) => {
      const itemTemp = parseInt(item, 10);
      switch (index) {
        case 0:
          YAdd = itemTemp;
          break;
        case 1:
          MAdd = itemTemp;
          break;
        case 2:
          DAdd = itemTemp;
          break;
        case 3:
          HAdd = itemTemp;
          break;
        default:
          break;
      }
    });
    const y = initDate.getFullYear();
    const M = initDate.getMonth();
    const d = initDate.getDate();
    const h = initDate.getHours();
    const m = initDate.getMinutes();
    const s = initDate.getSeconds();
    return new Date(y + YAdd, M + MAdd, d + DAdd, h + HAdd, m, s);
  };

  renderItems = () => {
    const { productInfo } = this.props;
    const parameters = Object.prototype.hasOwnProperty.call(
      productInfo,
      "parameters"
    )
      ? productInfo.parameters
      : [];
    return parameters.map(item => this.renderItem(item));
  };

  calculateInsuranceEnd = () => {
    if (this.insurancePeriod) {
      const insurancePeriodTemps = this.insurancePeriod.split("-");
      const insurancePeriodTemp =
        insurancePeriodTemps[insurancePeriodTemps.length - 1];
      const insurancePeriodUnit = insurancePeriodTemp.charAt(
        insurancePeriodTemp.length - 1
      );
      const insurancePeriodValue = insurancePeriodTemp.substring(
        0,
        insurancePeriodTemp.length - 1
      );
      let insurancePeriod = null;
      switch (insurancePeriodUnit) {
        case "y":
          insurancePeriod = `${insurancePeriodValue},0,0,0,0,0`;
          break;
        case "m":
          insurancePeriod = `0,${insurancePeriodValue},0,0,0,0`;
          break;
        case "d":
          insurancePeriod = `0,0,${insurancePeriodValue},0,0,0`;
          break;
        case "h":
          insurancePeriod = `0,0,0,${insurancePeriodValue},0,0`;
          break;
        default:
          break;
      }
      if (insurancePeriod === null) {
        return;
      }
      const insuranceEnd = this.calculateDateTime(
        this.insuranceBegin,
        insurancePeriod
      );
      const values = {};
      values[this.insuranceEndKey] = moment(
        moment(insuranceEnd).add(-1, "s")
      ).format("YYYY-MM-DD HH:mm");
      this.form.setFieldsValue(values);
    }
  };

  renderItem = item => {
    const { dispatch } = this.props;
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
      intervalValue,
      maxValue,
      options,
    } = item;
    let { defaultValue } = item;
    const { proposalSaveInfo } = this.props;
    const { base } = proposalSaveInfo;
    defaultValue = base[key] ? base[key] : defaultValue;
    const onValueChange = () => {
      // 保费试算
      dispatch({
        type: "proposalSaveSpace/premiumCaculate",
        payload: { form: this.form },
      });
    };

    switch (type) {
      case "01":
        if (defaultValue) {
          this.insurancePeriod = defaultValue;
        }
        return (
          <FormPicker
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
            onSuperChange={value => {
              [this.insurancePeriod] = value;
              this.calculateInsuranceEnd();
              onValueChange();
            }}
            placeholder={tips}
          />
        );
      case "02":
        return (
          <FormInput
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
            onSuperChange={() => {
              onValueChange();
            }}
            placeholder={tips}
          />
        );
      case "03":
        return (
          <FormInput
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
            onSuperChange={() => {
              onValueChange();
            }}
            placeholder={tips}
          />
        );
      case "04":
        return (
          <FormInput
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
            onSuperChange={() => {
              onValueChange();
            }}
            placeholder={tips}
          />
        );
      case "06": {
        this.insuranceEndKey = key;
        return (
          <FormInput
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
            onSuperChange={() => {
              onValueChange();
            }}
            placeholder={tips}
          />
        );
      }
      case "07": {
        let nowDate = new Date();
        const y = nowDate.getFullYear();
        const M = nowDate.getMonth();
        const d = nowDate.getDate();
        nowDate = new Date(y, M, d);
        const minDate = this.calculateDateTime(nowDate, minValue);
        const maxDate = this.calculateDateTime(minDate, intervalValue);
        this.insuranceBegin =
          defaultValue && defaultValue.length > 0
            ? moment(defaultValue, "YYYY-MM-DD HH:mm:ss").toDate()
            : minDate;
        return (
          <FormDatePicker
            key={key}
            title={title}
            name={key}
            mode="datetime"
            minDate={minDate}
            maxDate={maxDate}
            defaultValue={this.insuranceBegin}
            rules={[
              {
                required: must === "1",
                message: tips,
              },
            ]}
            isHide={show === "0"}
            onSuperChange={value => {
              this.insuranceBegin = value;
              this.calculateInsuranceEnd();
              onValueChange();
            }}
            placeholder={tips}
          />
        );
      }
      case "10": {
        return (
          <FormStepper
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
            onSuperChange={() => {
              onValueChange();
            }}
            placeholder={tips}
          />
        );
      }
      default:
        return (
          <FormInput
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
            onSuperChange={() => {
              onValueChange();
            }}
            placeholder={tips}
          />
        );
    }
  };

  render() {
    const {
      proposalSaveInfo,
      productInfo,
      productInfo2,
      getForm,
      dispatch,
    } = this.props;
    const { plans } = proposalSaveInfo;
    const itemKindsSupport = productInfo.itemKinds;
    const baseInfo2 = productInfo2.base || {};
    const professionSupport = baseInfo2.professionSupport || [];

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
          {this.renderItems()}
          {plans.map((item, index) => (
            <CreatePlan
              productInfo={productInfo}
              key={item.key}
              elementIndex={item.key}
              title={`保障计划${stringNumber[index + 1]}`}
              {...item}
              itemKindsSupport={itemKindsSupport}
              professionSupport={professionSupport}
              showRemove={plans.length > 1}
              planData={item}
              onRemove={() => {
                this.onRemovePlan(item.key);
              }}
              onCaculate={() => {
                // 保费试算
                dispatch({
                  type: "proposalSaveSpace/premiumCaculate",
                  payload: { form: this.form },
                });
              }}
              onPlanChange={(form, itemKinds) => {
                if (itemKinds.length > 0) {
                  // 保费试算
                  dispatch({
                    type: "proposalSaveSpace/premiumCaculate",
                    payload: { form },
                  });
                }
              }}
            />
          ))}
        </Form>
        <div className={styles.create}>
          <Button type="primary" onClick={this.onAddPlan}>
            <Icon type="iconxz" className={styles.icon} />
            新增保障计划
          </Button>
        </div>
      </div>
    );
  }
}
export default PlanComponent;
