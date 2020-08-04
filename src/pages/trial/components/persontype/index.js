import React from "react";
import { Icon, Toast } from "antd-mobile";
import Button from "tuns-mobile/lib/button";
import PersonType from "./persontype";
import styles from "./index.less";

class PersonTypes extends React.Component {
  onRmovePersonType = index => {
    const { data, onCaculate } = this.props;
    data.splice(index, 1);
    this.setState({}, () => {
      // 保费试算
      if (onCaculate) onCaculate();
    });
  };

  onAddPersonType = () => {
    const { data } = this.props;
    const max = 5;
    if (data.length >= max) {
      Toast.fail(`被保人类型最多添加${max}个`);
      return;
    }
    data.push({
      key: `${new Date().getTime()}`,
      insuredCount: 1,
    });
    this.setState({});
  };

  render() {
    const {
      data,
      planTitle,
      planData,
      itemKindsSupport,
      professionSupport,
    } = this.props;
    return (
      <div className={styles.root}>
        {data.map((item, index) => (
          <PersonType
            key={item.key}
            elementIndex={item.key}
            planTitle={planTitle}
            title={`被保人类型${index + 1}`}
            numberIndex={index}
            {...this.props}
            itemData={item}
            showRemove={data.length > 1}
            planData={planData}
            itemKindsSupport={itemKindsSupport || []}
            professionSupport={professionSupport || []}
            onRemove={() => {
              this.onRmovePersonType(index);
            }}
          />
        ))}
        <div className={styles.create}>
          <Button isActive onClick={this.onAddPersonType}>
            <Icon type="iconxz" className={styles.icon} />
            新增被保人类型
          </Button>
        </div>
      </div>
    );
  }
}

export default PersonTypes;
