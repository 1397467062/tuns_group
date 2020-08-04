import React from "react";
import cn from "classnames";
import { Card } from "antd-mobile";
import styles from "./index.less";

const { Header, Body } = Card;

const lineitem = item => {
  return (
    <div
      className={cn(styles.item, {
        [styles.itemhide]: !item.value && item.hideTitle,
      })}
      key={item.id}
    >
      <div
        className={styles.label}
        style={length ? { minWidth: `${length}0vw` } : {}}
      >
        {item.title}
      </div>
      <div className={styles.value}>{item.value}</div>
    </div>
  );
};

const lineitem2 = item => {
  return (
    <div
      className={cn(styles.item, {
        [styles.itemhide]: !item.value && item.hideTitle,
      })}
      key={item.id}
    >
      <div
        className={styles.label}
        style={length ? { minWidth: `${length}0vw` } : {}}
      >
        {item.title}
      </div>
      <div className={styles.idtype}>{item.typestr}</div>
      <div className={styles.num}>{item.number}</div>
    </div>
  );
};

const RightsCard = ({ title, info }) => {
  const { guarantees, occupations } = info;
  return (
    <Card className={styles.wrap}>
      <Header className={styles.title} title={title} />
      <Body>
        {guarantees.map(item => lineitem(item))}
        {occupations.map(option => (
          <div>
            <div className={styles.insinfo}>{option.title}</div>
            {option.info.map(item => lineitem(item))}
            {option.person.map(item => lineitem2(item))}
          </div>
        ))}
      </Body>
    </Card>
  );
};
export default RightsCard;
