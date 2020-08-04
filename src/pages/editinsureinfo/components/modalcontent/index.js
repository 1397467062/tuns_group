import React from "react";
import { Icon } from "antd-mobile";
import PropTypes from "prop-types";

import styles from "./index.less";

const ModalContent = props => {
  const { onClose, content, title } = props;
  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <div className={styles.titletext}>{title}</div>
        <div className={styles.titleclose} onClick={onClose && onClose}>
          <Icon type="cross" />
        </div>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

ModalContent.propTypes = {
  onClose: PropTypes.func,
  content: PropTypes.string,
};

ModalContent.defaultProps = {
  onClose: () => {},
  content: "",
};

export default ModalContent;
