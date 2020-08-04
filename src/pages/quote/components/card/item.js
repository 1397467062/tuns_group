import React from "react";
import FormBase from "tuns-mobile/lib/form/input";
import FormStepper from "tuns-mobile/lib/form/stepper";
import FormPick from "tuns-mobile/lib/form/picker"
import TeamPicker from "tuns-mobile/lib/form/teampick"
import PickerModal from "tuns-mobile/lib/form/teampick/pick"
import FormModalSelect from "tuns-mobile/lib/form/modal/select";
import FormDatePicker from "tuns-mobile/lib/form/datepicker";
import moment from "moment";
import Area from "./area"



/**
 * 13 保额选项 pick
 */
const insPickerItem = (item, params) => {
  let defaultValue = null;
  let data = null
  if (item.elOptions) {
    data = JSON.parse(item.elOptions);
    data.forEach(options => {
      options.label = options.name;
      options.id = options.value
      if (options.isDefault === "1") {
        defaultValue = options.value;
      }
    });
  }
  params.defaultValue = defaultValue;
  return (
    <TeamPicker
      title={item.pageElName}
      defaultValue={defaultValue}
      {...params}
    >
      <FormModalSelect data={data} {...params} title={item.pageElName} />
    </TeamPicker>
  )
}
/**
 * 05 城市 areapick
 */
const areaPickItem = (item, params) => {

  const data = Area.all()
  return (
    <FormPick
      data={data}
      cascade
      cols={2}
      pickTitle={item.pageElName}
      // defaultValue={["430000", "430100", "430101"]}
      extra={item.needTips}
      {...params}
    />
  )


}


/**
 * 01 选项 pick
 */
const pickerItem = (item, params) => {
  let defaultValue = null;
  let data = null
  if (item.elOptions) {
    data = JSON.parse(item.elOptions);
    data.forEach(options => {
      options.label = options.name;
      if (options.isDefault === "1") {
        defaultValue = options.value;
      }
    });
  }
  params.defaultValue = defaultValue;
  return (

    <TeamPicker
      title={item.pageElName}
      placeholder={item.needTips || "请选择"}
      {...params}
      defaultValue={defaultValue}
    >
      <PickerModal data={data} {...params} title={item.pageElName} />
    </TeamPicker>
  );
};

/**
 * 02 固定文本 disable
 */
const disableItem = (item, params) => {
  return (
    <FormBase
      value={item.value}
      editable={false}
      defaultValue={item.defaultValue}
      {...params}
    />
  );
};

/**
 * 03 输入框 base
 */
const baseItem = (item, params) => {
  return <FormBase placeholder={item.needTips} clear {...params} />;
};

/**
 * 10 数字加减框
 */
const stepItem = (item, params) => {
  return (
    <FormStepper
      defaultValue={item.minValue}
      min={item.minValue}
      max={item.maxValue}
      step="1"
      showNumber
      {...params}
    />
  );
};

/**
 * 11 时间区间
 */

const dateItem = (item, params) => {
  return (
    <FormDatePicker
      mode="date"
      minDate={transfDate(item.minTimestamp)}
      maxDate={transfDate(item.maxTimestamp)}
      extra={item.needTips}
      {...params}
    />
  );
};





const transfDate = (dateString, tem = "YYYY-MM-DD HH:mm:ss") => {
  return moment(dateString, tem).toDate();
};

export {
  pickerItem,
  disableItem,
  baseItem,
  stepItem,
  dateItem,
  insPickerItem,
  areaPickItem,
};
