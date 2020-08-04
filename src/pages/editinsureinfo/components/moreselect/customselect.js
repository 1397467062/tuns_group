import React from "react";
import Button from "tuns-mobile/lib/button";
import cn from "classnames";
import { Icon } from "antd-mobile";

import styles from "./customselect.less";

class CustomSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  onChangeVisible = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  render() {
    const { visible } = this.state;
    const { data, itemKind, onSelected } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.title}>
          <p className={styles.text}>{data.liabilityName}</p>
          <Icon
            type="iconjt"
            className={cn(styles.action, { [styles.open]: visible })}
            onClick={this.onChangeVisible}
          />
        </div>
        {visible ? (
          <div className={styles.more}>{data.liabilityDescribe}</div>
        ) : null}
        <div className={styles.selects}>
          {data.insuredAmounts.map(item => {
            if (item.support && item.supportInline) {
              if (!itemKind.insuredAmount) {
                if (item.default) {
                  itemKind.insuredAmount = item.insuredAmount;
                  itemKind.amountUnit = item.amountUnit;
                }
              }
            } else if (
              itemKind.insuredAmount === item.insuredAmount &&
              itemKind.amountUnit === item.amountUnit
            ) {
              itemKind.insuredAmount = null;
              itemKind.amountUnit = null;
              itemKind.insuredAmountText = null;
            }
            return (
              <Button
                key={item.insuredAmountText}
                isShadow={false}
                className={
                  item.support && item.supportInline ? null : "amount_disabled"
                }
                disabled={!item.support || !item.supportInline}
                isActive={
                  item.insuredAmount === itemKind.insuredAmount &&
                  item.amountUnit === itemKind.amountUnit &&
                  item.support &&
                  item.supportInline
                }
                onClick={() => {
                  if (
                    itemKind.insuredAmount === item.insuredAmount &&
                    itemKind.amountUnit === item.amountUnit
                  ) {
                    itemKind.insuredAmount = null;
                    itemKind.amountUnit = null;
                    itemKind.insuredAmountText = null;
                  } else {
                    itemKind.insuredAmount = item.insuredAmount;
                    itemKind.amountUnit = item.amountUnit;
                    itemKind.insuredAmountText = item.insuredAmountText;
                  }
                  if (onSelected) {
                    onSelected(itemKind);
                  }
                  this.setState({});
                }}
              >
                {item.insuredAmountText}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CustomSelect;
