import React from "react";
import { connect } from "dva";
import { storage } from "tuns-utils";
import { Toast, Modal } from "antd-mobile";
import Form from "tuns-mobile/lib/form";
import FormInput from "tuns-mobile/lib/form/input";
import FormPick from "tuns-mobile/lib/form/picker";
import FormUpload from "tuns-mobile/lib/form/upload";
import Button from "tuns-mobile/lib/button";
import { TSRouter as router } from "../../tools/router";
import { groupInfo } from "./data";
import BaseController from "../../components/controller";
import styles from "./index.less";

@connect(store => ({ record: store.record }))
class Record extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const {
      productCode = "",
      productName = "",
      insTypeId = "",
      insTypeName = "",
    } = query;
    this.state = {
      productId: productCode,
      productName,
      insTypeId,
      insTypeName,
    };
  }

  componentDidMount() {
    this.setTitle("帮我录单");
  }

  onSubmit = form => {
    form.validateFields((error, value) => {
      // eslint-disable-next-line no-console
      console.log(error, value);
      if (error) {
        const key = Object.keys(error)[0];
        const { errors } = error[key];
        const { message } = errors[0];
        return Toast.info(message);
      }
      const { dispatch } = this.props;
      // 组件的数据为数组 要转换一下
      const { identificationType: idType, identificationUrl: url } = value;
      value.identificationType = idType.toString();
      value.identificationUrl = JSON.stringify(url);
      dispatch({
        type: "record/helpMeRecord",
        payload: {
          ...value,
          ...this.state,
        },
      }).then(res => {
        const { response } = res;
        const { head } = response;
        if (head.messageCd !== "0000") {
          Toast.fail(head.messageInf);
        } else {
          Modal.alert(
            "",
            <div style={{ padding: "30px", color: "#333333" }}>
              帮我录单申请提交成功！点击确定回到团险首页
            </div>,
            [
              {
                text: "确认",
                onPress: () => {
                  router.go(-3);
                },
                style: { color: "#FB7037" },
              },
            ]
          );
        }
      });
    });
  };

  submitRender = form => {
    return (
      <div className={styles.submit}>
        <Button
          onClick={this.onSubmit.bind(this, form)}
          isActive
          isGradual
          type="primary"
          className={styles.button}
        >
          立即提交
        </Button>
      </div>
    );
  };

  renderItem = () => {
    const token = storage.get("token");
    return groupInfo.map(item => {
      switch (item.type) {
        case "header":
          return <div className={styles.header}>{item.title}</div>;
        case "pick":
          return (
            <FormPick
              title={item.title}
              name={item.name}
              data={item.data}
              extra={item.placeholder}
              cascade
              cols={1}
              rules={[
                {
                  required: true,
                  message: `${item.placeholder}`,
                },
              ]}
            />
          );
        case "file":
          return (
            <FormUpload
              name={item.name}
              title={item.title}
              rules={[
                {
                  required: false,
                  message: `${item.placeholder}`,
                },
              ]}
              token={token}
            />
          );
        case "input":
          return (
            <FormInput
              title={item.title}
              name={item.name}
              placeholder={item.placeholder}
              moneyKeyboardAlign="right"
              rules={[
                ...item.rules,
                {
                  required: true,
                  message: `${item.placeholder}`,
                },
              ]}
            />
          );
        default:
          return <></>;
      }
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <Form submitRender={this.submitRender.bind(this)}>
          {this.renderItem()}
        </Form>
      </div>
    );
  }
}

export default Record;
