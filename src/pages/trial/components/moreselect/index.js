import React from "react";
import Button from "tuns-mobile/lib/button";
import { Toast } from "antd-mobile";
import CustomSelect from "./customselect";
import styles from "./index.less";
import { ProfessionAmountRule } from "../../../../insrules/professionamountrule";
import { defaultSelect } from "../../../../insrules/default";
// import { itemKindCheck } from "../../../../../public/insrules/MP18200127_source";

class MoreSelect extends React.Component {
  constructor(props) {
    super(props);
    let { itemKindsSupport } = this.props;
    const { itemKinds, planData, professionSupport } = this.props;
    if (!itemKindsSupport) {
      itemKindsSupport = [];
    }
    const itemKindsSupportTemp = [];
    itemKindsSupport.forEach(item => {
      itemKindsSupportTemp.push(item);
      const subItemKinds = item.itemKinds;
      if (subItemKinds) {
        subItemKinds.forEach(subItem => {
          itemKindsSupportTemp.push(subItem);
        });
      }
    });
    const itemKindsTemp = JSON.parse(JSON.stringify(itemKinds));
    // 默认选择第一个或默认
    defaultSelect(itemKindsTemp, itemKindsSupportTemp);
    const itemKindsTempDic = {};
    itemKindsTemp.forEach(itemKindTemp => {
      itemKindsTempDic[itemKindTemp.liabilityCode] = itemKindTemp;
    });
    // eslint-disable-next-line no-undef
    itemKindCheck(itemKindsTemp, itemKindsSupportTemp, null);
    ProfessionAmountRule(planData, itemKindsSupportTemp, professionSupport);
    this.state = { itemKindsSupportTemp, itemKindsTempDic, itemKindsTemp };
  }

  render() {
    const {
      itemKindsSupportTemp,
      itemKindsTempDic,
      itemKindsTemp,
    } = this.state;
    const {
      itemKinds,
      enter,
      onChange,
      onClose,
      currentProfessionSupport,
    } = this.props;
    // 以下可能重复
    let professionMsg = "（当前计划支持";
    currentProfessionSupport.forEach((item, index) => {
      if (index > 0) {
        professionMsg += "、";
      }
      professionMsg += item;
    });
    professionMsg += "类职业投保）";
    return (
      <div className={styles.root}>
        <div className={styles.title}>
          <p className={styles.text}>当前计划</p>
          <span className={styles.more}>{professionMsg}</span>
        </div>
        <div className={styles.content}>
          {itemKindsSupportTemp.map(item => {
            let itemKind = itemKindsTempDic[item.liabilityCode];
            if (!itemKind) {
              itemKind = {};
              itemKindsTempDic[item.liabilityCode] = itemKind;
            }
            itemKind.liabilityName = item.liabilityName;
            itemKind.liabilityInsCode = item.liabilityInsCode;
            itemKind.liabilityTypeCode = item.liabilityTypeCode;
            itemKind.liabilityAbstract = item.liabilityAbstract;
            itemKind.liabilityDescribe = item.liabilityDescribe;
            return (
              <CustomSelect
                key={item.liabilityCode}
                itemKind={itemKind}
                data={item}
                onSelected={currentItemKind => {
                  // eslint-disable-next-line no-undef
                  itemKindCheck(
                    itemKindsTemp,
                    itemKindsSupportTemp,
                    currentItemKind
                  );
                  const itemKindsTempDicNew = { ...itemKindsTempDic };

                  itemKindsTemp.forEach(itemKindTemp => {
                    itemKindsTempDicNew[
                      itemKindTemp.liabilityCode
                    ] = itemKindTemp;
                  });
                  this.setState({
                    itemKindsTempDic: itemKindsTempDicNew,
                  });
                }}
              />
            );
          })}
        </div>
        <div className={styles.action}>
          <Button
            type="primary"
            onClick={() => {
              itemKinds.splice(0, itemKinds.length);
              for (const key in itemKindsTempDic) {
                if (
                  key &&
                  Object.prototype.hasOwnProperty.call(itemKindsTempDic, key)
                ) {
                  const itemKindTemp = itemKindsTempDic[key];
                  if (itemKindTemp.insuredAmountText) {
                    itemKindTemp.liabilityCode = key;

                    itemKinds.push(itemKindTemp);
                  }
                }
              }
              // eslint-disable-next-line no-undef
              const { messages } = itemKindCheck(
                itemKinds,
                itemKindsSupportTemp,
                null
              );
              if (messages && messages.length > 0) {
                Toast.fail(messages[0], 1.5);
                return;
              }
              enter(itemKinds);
              onChange(itemKinds.length > 0 ? "1" : null);
              onClose();
            }}
          >
            确定
          </Button>
        </div>
      </div>
    );
  }
}

export default MoreSelect;
