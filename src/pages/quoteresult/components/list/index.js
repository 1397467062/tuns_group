import React from "react";
import { List } from "antd-mobile";
import cell from "../cell";
import styles from "./index.less";

const renderHeader = totalnum => {
  return (
    <div className={styles.header}>
      投保人数统计（共计
      {totalnum}
      人）
    </div>
  );
};

const InsList = ({ costTotal = [], totalnum = 0, premAmounts = {} }) => {
  return (
    <List className={styles.main} renderHeader={() => renderHeader(totalnum)}>
      {costTotal.map(item =>
        cell({
          title: item.companyName,
          money: premAmounts[item.inqPlanId],
          prodid: item.productId,
          data: item,
        })
      )}
    </List>
  );
};
export default InsList;
