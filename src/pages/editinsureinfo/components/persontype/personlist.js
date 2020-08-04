import React from "react";
import cn from "classnames";
import { Icon } from "antd-mobile";
import styles from "./personlist.less";

class PersonList extends React.Component {
  render() {
    const { data: insureds, onRmove, changeShowList, showList } = this.props;
    return (
      <div className={styles.root}>
        <div
          className={
            insureds.length > 0 && showList.showList
              ? `${styles.infoTitle} ${styles.infoTitleHasCount}`
              : styles.infoTitle
          }
        >
          <div className={styles.text}>被保人详情</div>
          <div
            className={cn(styles.action, { [styles.open]: showList.showList })}
            onClick={changeShowList}
          >
            <Icon type="iconjt" />
          </div>
        </div>
        {showList.showList && insureds.length > 0 ? (
          <div className={styles.list}>
            {insureds.map((item, index) => (
              <div className={styles.item} key={index}>
                <div className={styles.left}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.text}>
                    {`${item.identityTypeName} ${item.identityNumber}`}
                  </div>
                </div>
                <div className={styles.right}>
                  <a onClick={onRmove.bind(this, index)}>删除</a>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

export default PersonList;
