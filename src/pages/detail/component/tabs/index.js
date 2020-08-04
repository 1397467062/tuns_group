import React from "react";
import { List, Card } from "antd-mobile";
import UITab from "tuns-mobile/lib/tabs";
import Title from "../title";

import styles from "./index.less";

const renderProduct = img => (
  <div className={styles.product}>
    <img src={img} alt="" />
  </div>
);

const tabs = [
  { title: "产品特色" },
  { title: "投保须知" },
  { title: "产品条款" },
  { title: "理赔服务" },
];

const renderNotice = (title, buyNotice) => (
  <div className={styles.notice}>
    <Card full>
      <Card.Header title={title} className={styles.header} />
      <Card.Body>
        <div className={styles.content}>{buyNotice}</div>
      </Card.Body>
    </Card>
  </div>
);

const renderTerms = terms => {
  return (
    <div className={styles.terms}>
      <List renderHeader={<Title title="产品条款" />}>
        {terms.map(item => (
          <List.Item
            arrow="horizontal"
            onClick={() => {
              window.location.href = item.attachFullUrl;
            }}
            key={item.attachName}
          >
            {item.attachName}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

const Tabs = ({ tab, img }) => {
  const { buyNotice, claimProcess, terms } = tab;
  return (
    <div className={styles.root}>
      <UITab tabs={tabs} swipeable={false}>
        {renderProduct(img["01"][0])}
        {renderNotice("投保须知", buyNotice)}
        {renderTerms(terms)}
        {renderNotice("理赔服务", claimProcess)}
      </UITab>
    </div>
  );
};

export default Tabs;
