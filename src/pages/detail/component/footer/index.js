import React from "react";
import { Icon, Modal, ActionSheet, Toast } from "antd-mobile";
import Bottom from "tuns-mobile/lib/bottom";
import { TSRouter as router } from "../../../../tools/router";
import ModalContent from "../modalcontent";

import styles from "./index.less";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showActionSheet = () => {
    const BUTTONS = [
      "客服工作时间：工作日08:30~17:30",
      "拨打客服热线 4000-1936-00",
      "取消",
    ];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        maskClosable: true,
      },
      buttonIndex => {
        if (buttonIndex === 1) window.location.href = "tel:4000193600";
      }
    );
  };

  onToggleVisible = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  onSubmit = (form, notice) => {
    form.validateFields(error => {
      if (error) {
        const key = Object.keys(error)[0];
        const { errors } = error[key];
        const { message } = errors[0];
        return Toast.info(message);
      }
      const { getFormValues } = this.props;
      // 执行表单数据获取并存入models
      getFormValues();
      if (notice.healthNotice) {
        this.onToggleVisible();
        return;
      }
      router.push(`/editinsureinfo?productCode=${notice.productId}`);
    });
  };

  onOffline = () => {
    Modal.alert(
      "",
      <div style={{ padding: "30px", color: "#333333" }}>
        线下出单申请已成功提交！
      </div>,
      [
        {
          text: "确认",
          onPress: () => {},
          style: { color: "#FB7037" },
        },
      ]
    );
  };

  leftRender = () => (
    <div className={styles.button} onClick={this.showActionSheet}>
      <Icon type="iconkf" size="md" color="#999" />
      <p>客服</p>
    </div>
  );

  render() {
    const { form, notice = {}, premium = 0, code, productCode } = this.props;
    const { visible } = this.state;
    const { healthNotice = "", healthNoticeButton = "" } = notice;
    let { buttonConf = "[]" } = notice;
    try {
      if (buttonConf === "") {
        buttonConf = [];
      } else {
        buttonConf = JSON.parse(buttonConf);
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return (
      <div className={styles.root}>
        <Bottom
          total={premium}
          buttonText={code === "3" ? "立即投保" : "线下出单"}
          buttonClick={
            code === "3"
              ? this.onSubmit.bind(this, form, notice)
              : this.onOffline.bind(this)
          }
          leftRender={this.leftRender}
          scale={2}
          organization
          totalUnit="元/人"
        />
        <Modal
          popup
          animationType="slide-up"
          visible={visible}
          onClose={this.onToggleVisible}
        >
          <ModalContent
            onClose={this.onToggleVisible}
            content={healthNotice}
            hasButton={healthNoticeButton}
            data={buttonConf}
            productCode={productCode}
          />
        </Modal>
      </div>
    );
  }
}

export default Footer;
