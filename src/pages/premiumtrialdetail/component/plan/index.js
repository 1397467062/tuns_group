import React from "react";
import { Card, List } from "antd-mobile";
import FormAccordion from "tuns-mobile/lib/form/accordion";
import Form from "tuns-mobile/lib/form";
import styles from "./index.less";

class Plan extends React.Component {
  render() {
    const { plan, itemKindsDic } = this.props;
    const { itemKinds, professions } = plan;
    const itemKindsData = [];
    itemKinds.forEach(itemKindItem => {
      const itemKindInfo = itemKindsDic[itemKindItem.liabilityCode];
      if (itemKindInfo) {
        itemKindsData.push({
          id: itemKindItem.liabilityCode,
          title: itemKindInfo.liabilityName,
          content: itemKindInfo.liabilityDescribe,
          value: itemKindItem.liabilityCode,
          money: itemKindItem.insuredAmountText,
        });
      }
    });

    return (
      <div className={styles.root}>
        <Card full>
          <Card.Header title={plan.planName} />
          <Card.Body>
            <div className={styles.sub_title}>保障计划</div>
            <Form>
              <FormAccordion name="check" data={itemKindsData} />
            </Form>
            <div className={styles.sub_title}>被保人类型</div>
            {professions.map(professionItem => (
              <List.Item
                key={professionItem.professionCode}
                extra={`${professionItem.insuredCount}人`}
              >
                {professionItem.professionName}
              </List.Item>
            ))}
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Plan;
