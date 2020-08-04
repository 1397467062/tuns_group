import React from "react";
import { Button } from "antd-mobile";
import { TSRouter as router } from "../../../../tools/router";
import styles from "./index.less";

const cell = props => {
  const { title = "", money = 0, prodid } = props;
  return (
    <div className={styles.cell} key={prodid}>
      <div className={styles.title}>
        {title}
        <div className={styles.money}>
          {`¥${parseFloat(money || 0).toFixed(2)}`}
        </div>
      </div>
      <Button className={styles.btn} onClick={() => onClick(prodid)}>
        立即投保
      </Button>
    </div>
  );
};

const onClick = prodid => {
  router.push(`/detail?productCode=${prodid}`);
};
export default cell;
