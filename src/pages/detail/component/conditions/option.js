import React from "react";
import SelectButton from "tuns-mobile/lib/form/selectbutton";
import FormBase from "tuns-mobile/lib/form/input";
import FormDrawer from "tuns-mobile/lib/form/drawer";
import FormDrawerSelect from "tuns-mobile/lib/form/drawer/select";
import FormStepper from "tuns-mobile/lib/form/stepper";
import FormPick from "tuns-mobile/lib/form/picker";
import { TSRouter as router } from "../../../../tools/router";
import { compare } from "../../../../utils/rules";

let profRule = null;

export const getRule = rule => {
  profRule = rule;
};

// 是否符合投保条件
export const isProfessionData = (value, rule = null) => {
  const rules = rule || profRule;
  return compare(value, JSON.parse(rules));
};

const Option = (
  item,
  { dispatch, premiumTrialFlag: isPre, profession },
  productCode,
  onSavePremiumInfo,
  onRestAmount,
  onRestValue,
  getFormValues
) => {
  const {
    type,
    id,
    title,
    name,
    isNeed,
    needTips,
    isShow,
    data,
    isDefault,
    text,
    countPrem,
    condRuleList,
  } = item;

  switch (type) {
    case "01":
      // 该情况下展示一个保费是算的按钮，保障计划的按钮内容被覆盖
      if (isPre === "1" && name === "noncar_insurance_guarantee_proj") {
        return (
          <SelectButton
            key={id}
            name={name}
            title={title}
            isHide={isShow === "0"}
            data={[{ id: "1", value: "1", name: "保费试算" }]}
            defaultValue="1"
            rules={[
              {
                required: false,
                message: `${needTips}`,
              },
            ]}
            onSuperChange={() => {
              getFormValues();
              router.push(`/trial?productCode=${productCode}`);
            }}
          />
        );
      } else if (data.length <= 3) {
        return (
          <SelectButton
            key={id}
            name={name}
            title={title}
            isHide={isShow === "0"}
            data={data}
            defaultValue={isDefault}
            rules={[
              {
                required: isNeed === "1",
                message: `${needTips}`,
              },
            ]}
            onSuperChange={() => {
              if (countPrem === "1") {
                onSavePremiumInfo();
              }
            }}
          />
        );
      } else if (data.length > 3) {
        return (
          <FormPick
            key={id}
            title={title}
            name={name}
            cascade
            cols={1}
            isHide={isShow === "0"}
            data={data}
            defaultValue={[isDefault]}
            onSuperChange={() => {
              onSavePremiumInfo();
            }}
            rules={[
              {
                required: isNeed === 1,
                message: `${needTips}`,
              },
            ]}
          />
        );
      }
      break;
    case "02":
      return (
        <FormBase
          title={title}
          key={id}
          name={name}
          editable={false}
          value={text}
          defaultValue={text}
          isHide={isShow === "0"}
        />
      );
    case "09":
      return (
        <FormDrawer
          key={id}
          name={name}
          title={title}
          isHide={isShow === "0"}
          rules={[
            {
              required: isNeed === "1",
              message: `${needTips}`,
            },
          ]}
          buttonText="请选择职业"
        >
          <FormDrawerSelect
            data={profession}
            autoClose
            errorClose={false}
            onChangeDisplay={a => {
              if (!isProfessionData(a.classify, condRuleList[0].ruleDetail)) {
                onRestValue(name);
                dispatch({
                  type: "detail/saveCheckedProfession",
                  payload: null,
                });
              } else {
                onRestAmount();
                onSavePremiumInfo();
                dispatch({
                  type: "detail/saveCheckedProfession",
                  payload: a,
                });
                dispatch({
                  type: "detail/porfAmountRule",
                  payload: a.value,
                });
                return a.classify ? `${a.classify}类 ${a.name}` : "";
              }
            }}
            customRule={moreItem => {
              const { classify } = moreItem;
              return isProfessionData(classify, condRuleList[0].ruleDetail);
            }}
            more={moreItem => {
              const { classify } = moreItem;
              const isError = isProfessionData(
                classify,
                condRuleList[0].ruleDetail
              );
              return `类别：${classify === "99" ? "拒保" : classify}类 （${
                isError ? "" : "不"
              }符合投保条件）`;
            }}
          />
        </FormDrawer>
      );
    case "10":
      return (
        <FormStepper
          title={title}
          key={id}
          name={name}
          defaultValue={1}
          isHide={isShow === "0"}
          min={1}
          max={2}
          step="1"
          showNumber
          rules={[
            {
              required: isNeed === "1",
              message: `${needTips}`,
            },
          ]}
        />
      );
    default:
      return <></>;
  }
};

export default Option;
