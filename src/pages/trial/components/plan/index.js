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
  productInfo: store.proposalTrialSpace.productInfo,
  proposalTrialInfo: store.proposalTrialSpace.proposalTrialInfo,
}))
class PlanComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onRemovePlan = key => {
    const { dispatch } = this.props;
    dispatch({ type: "proposalTrialSpace/removePlan", payload: key }).then(
      () => {
        // 保费试算
        dispatch({
          type: "proposalTrialSpace/premiumCaculate",
          payload: { form: this.form },
        });
      }
    );
  };

  onAddPlan = () => {
    const { proposalTrialInfo, dispatch } = this.props;
    const { plans } = proposalTrialInfo;

    const maxPlan = stringNumber.length - 1;
    if (plans.length >= maxPlan) {
      Toast.fail(`保障计划最多添加${maxPlan}个`);
      return;
    }

    dispatch({ type: "proposalTrialSpace/addPlan" });
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
    const { proposalTrialInfo } = this.props;
    const { base } = proposalTrialInfo;
    defaultValue = base[key] ? base[key] : defaultValue;
    const onValueChange = () => {
      // 保费试算
      dispatch({
        type: "proposalTrialSpace/premiumCaculate",
        payload: { form: this.form },
      });
    };

    switch (type) {
      case "01":
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
    const { proposalTrialInfo, productInfo, getForm, dispatch } = this.props;
    const { plans } = proposalTrialInfo;
    const itemKindsSupport = productInfo.itemKinds;
    const baseInfo = productInfo.base || {};
    const professionSupport = baseInfo.professionSupport || [];

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
              onCaculate={() => {
                // 保费试算
                dispatch({
                  type: "proposalTrialSpace/premiumCaculate",
                  payload: { form: this.form },
                });
              }}
              onRemove={() => {
                this.onRemovePlan(item.key);
              }}
              onPlanChange={(form, itemKinds) => {
                if (itemKinds.length > 0) {
                  // 保费试算
                  dispatch({
                    type: "proposalTrialSpace/premiumCaculate",
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
