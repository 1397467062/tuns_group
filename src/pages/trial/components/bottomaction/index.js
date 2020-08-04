import React from "react";
import { Icon, ActionSheet } from "antd-mobile";
import Button from "tuns-mobile/lib/button";
import BottomButton from "tuns-mobile/lib/bottom";
import styles from "./index.less";

const LeftRender = () => {
  const showActionSheet = () => {
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

  return (
    <div className={styles.left} onClick={showActionSheet}>
      <Icon type="iconkf" className={styles.icon} />
      <p className={styles.text}>客服</p>
    </div>
  );
};
const ActionRender = ({ onStorageClick, onNextClick }) => {
  return (
    <div className={styles.action}>
      <Button className={styles.btn} isShadow={false} onClick={onStorageClick}>
        转发报价单
      </Button>
      <Button className={styles.btn} type="primary" onClick={onNextClick}>
        立即投保
      </Button>
    </div>
  );
};

const BottomActionComponent = props => {
  const { onStorageClick, onNextClick, premium } = props;
  return (
    <div className={styles.root}>
      <BottomButton
        totalText="预计总保费"
        total={premium}
        leftRender={LeftRender}
        renderAction={
          <ActionRender
            onStorageClick={onStorageClick}
            onNextClick={onNextClick}
          />
        }
        organization
        totalUnit="元"
      />
    </div>
  );
};

export default BottomActionComponent;
