import React from "react";
import { Icon } from "antd-mobile";
import PropTypes from "prop-types";
import styles from "./index.less";

// 0-等待支付,1-支付成功,2-支付失败 3-订单关闭

const orderStauts = {
  0: {
    icon: "iconddzf",
    title: "等待支付",
    text: "需支付",
  },
  1: {
    icon: "iconzfcg",
    title: "支付完成",
    text: "已支付",
  },
  2: {
    icon: "iconzfgb",
    title: "支付关闭",
  },
  3: {
    icon: "iconzfgb",
    title: "订单关闭",
  },
};

/**
 * @param {number} props.classname 样式
 * @param {number} props.status 订单的状态码
 * @param {string} props.money 金额数
 * @param {number} props.scale 保留小数点精确度
 */
const Order = props => {
  const { status, money } = props;

  const config = orderStauts[status];

  if (!config) {
    return <div className={styles.unknow}>状态未知</div>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>
        <Icon type={config.icon} className={styles.iconstyle} />
      </div>
      <div>
        <div className={styles.title}>
          <span>{config.title}</span>
        </div>
        <div className={styles.text}>
          {status !== 2 ? (
            <span>{`${config.text}: ${money}`}</span>
          ) : (
            "付款时间超时"
          )}
        </div>
      </div>
    </div>
  );
};

Order.propTypes = {
  status: PropTypes.number.isRequired,
  money: PropTypes.string.isRequired,
};
export default Order;
