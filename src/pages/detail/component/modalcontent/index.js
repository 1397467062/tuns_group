import React from "react";
import { Icon, Modal } from "antd-mobile";
import PropTypes from "prop-types";
import { isEmpty } from "tuns-utils";
import Button from "tuns-mobile/lib/button";
import { TSRouter as router } from "../../../../tools/router";
import styles from "./index.less";

const handleClick = (url, type, productCode) => {
  if (!isEmpty(url)) {
    window.location.href = url;
  }
  if (isEmpty(url) && type === "right") {
    const alertInfo = Modal.alert(
      "抱歉，您暂时无法投保!",
      "被保险人未能通过本次投保健康审核。",
      [
        {
          text: "知道了",
          onPress: () => {
            alertInfo.close();
          },
        },
        {
          text: "其他保障",
          onPress: () => {
            alertInfo.close();
          },
        },
      ]
    );
  }
  if (isEmpty(url) && type === "left") {
    router.push(`/editinsureinfo?productCode=${productCode}`);
  }
  if (isEmpty(url) && type === "single") {
    // 单个按钮直接跳转投保信息页
    router.push(`/editinsureinfo?productCode=${productCode}`);
  }
};

const renderButton = (data, productCode) => {
  if (data.length === 1) {
    return (
      <Button
        className={styles.button}
        type="primary"
        isGradual
        onClick={handleClick.bind(
          this,
          data[0].jumpUrl,
          data[0].btnType,
          productCode
        )}
      >
        {data[0].btnValue}
      </Button>
    );
  } else {
    return data.map(item => {
      return (
        <Button
          className={`${styles.button} ${
            item.btnType === "left" ? styles.left : styles.right
          }`}
          type="primary"
          onClick={handleClick.bind(
            this,
            item.jumpUrl,
            item.btnType,
            productCode
          )}
          key={item.btnType}
        >
          {item.btnValue}
        </Button>
      );
    });
  }
};

const ModalContent = props => {
  const { onClose, content, hasButton, data, productCode } = props;
  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <div className={styles.titletext}>健康告知</div>
        <div className={styles.titleclose} onClick={onClose && onClose}>
          <Icon type="cross" />
        </div>
      </div>
      <div className={styles.content}>{content}</div>
      <div className={styles.action}>
        {hasButton === "1" && renderButton(data, productCode)}
      </div>
    </div>
  );
};

ModalContent.propTypes = {
  onClose: PropTypes.func,
  content: PropTypes.string,
  hasButton: PropTypes.string,
  data: PropTypes.array,
};

ModalContent.defaultProps = {
  onClose: () => {},
  content: "",
  hasButton: "0",
  data: [],
};

export default ModalContent;
