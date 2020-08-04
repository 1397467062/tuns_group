import React, { useState } from "react";
import { Toast } from "antd-mobile";
import Form from "tuns-mobile/lib/form";
import FormInput from "tuns-mobile/lib/form/input";
import FormPicker from "tuns-mobile/lib/form/picker";
import FormDatePicker from "tuns-mobile/lib/form/datepicker";
import Button from "tuns-mobile/lib/button";
import { getRule } from "utils/rules";
import {
  validateIdCard,
  sexFromIdCard,
  dateFromIdCard,
} from "../../../../utils";

import styles from "./createperson.less";

const data = [
  [
    {
      value: "01",
      label: "身份证",
    },
    {
      value: "05",
      label: "护照",
    },
    {
      value: "07",
      label: "驾驶证",
    },
    {
      value: "06",
      label: "军官证",
    },
    {
      value: "99",
      label: "其他",
    },
  ],
];

const sexOptions = [
  [
    {
      value: "1",
      label: "男",
    },
    {
      value: "2",
      label: "女",
    },
  ],
];

const createPersonSubmit = (onSave, form) => {
  const onSubmit = () => {
    form.validateFields((error, value) => {
      if (error === null && typeof onSave === "function") {
        const identityType = value.identityType[0];
        const option = data[0].filter(item => {
          return item.value === identityType;
        });
        value.identityTypeName = option[0].label;
        onSave(value);
      } else {
        const key = Object.keys(error)[0];
        const { errors } = error[key];
        const { message } = errors[0];
        Toast.fail(message, 1);
      }
    });
  };
  return (
    <div className={styles.action}>
      <Button type="primary" isShadow={false} onClick={onSubmit}>
        确定
      </Button>
    </div>
  );
};

const CreatePerson = props => {
  const [person, updatePerson] = useState({
    name: null,
    identityType: ["01"],
    identityNumber: null,
    birth: null,
    sex: ["1"],
  });

  const { onSave } = props;
  return (
    <div className={styles.root}>
      <Form submitRender={createPersonSubmit.bind(null, onSave)} on>
        <FormInput
          title="姓名"
          name="name"
          placeholder="请输入姓名"
          rules={[
            ...getRule("public:name").rules,
            {
              required: true,
              message: "请输入姓名",
            },
          ]}
        />
        <FormPicker
          defaultValue={["01"]}
          title="证件类型"
          name="identityType"
          data={data}
          rules={[
            {
              required: true,
              message: "请选择证件类型",
            },
          ]}
          onOk={value => {
            updatePerson({ ...person, identityType: value });
          }}
        />
        <FormInput
          title="证件号码"
          name="identityNumber"
          placeholder="请填写对应的证件号码"
          rules={[
            {
              required: true,
              message: "请填写对应的证件号码",
            },
            (rule, value, callback) => {
              const errors = [];
              if (
                person.identityType.length > 0 &&
                person.identityType[0] === "01"
              ) {
                if (validateIdCard(value)) {
                  const sex = sexFromIdCard(value, true);
                  const birth = dateFromIdCard(value, true);
                  const newPerson = {};
                  if (sex) {
                    newPerson.sex = [sex];
                  }
                  if (birth) {
                    newPerson.birth = birth;
                  }
                  updatePerson({
                    ...person,
                    ...newPerson,
                  });
                } else {
                  errors.push(new Error(`请输入正确的身份证号码`, rule.field));
                }
              }
              callback(errors);
            },
          ]}
        />
        <FormDatePicker
          mode="date"
          title="生日"
          name="birth"
          rules={[
            {
              required: true,
              message: "请选择出生日期",
            },
          ]}
          minDate={new Date(1900, 0, 1)}
          maxDate={new Date()}
          defaultValue={person.birth}
        />
        <FormPicker
          defaultValue={person.sex}
          title="性别"
          name="sex"
          data={sexOptions}
          rules={[
            {
              required: true,
              message: "请选择性别",
            },
          ]}
        />
      </Form>
    </div>
  );
};

export default CreatePerson;
