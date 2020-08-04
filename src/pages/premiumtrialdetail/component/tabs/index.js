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
              window.location.href = item.url;
            }}
            key={item.name}
          >
            {item.name}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

const Tabs = ({ productInfo, page, onChange }) => {
  const {
    pictures,
    instructions,
    claimServices,
    productLiabilitys,
  } = productInfo;
  return (
    <div className={styles.root}>
      <UITab tabs={tabs} page={page} onChange={onChange}>
        {renderProduct(
          pictures && pictures.length > 0 ? pictures[0].imageUrl : null
        )}
        {renderNotice(
          "投保须知",
          instructions && instructions.length > 0
            ? instructions[0].instruction
            : null
        )}
        {renderTerms(productLiabilitys || [])}
        {renderNotice(
          "理赔服务",
          claimServices && claimServices.length > 0
            ? claimServices[0].claimService
            : null
        )}
      </UITab>
    </div>
  );
};

export default Tabs;
