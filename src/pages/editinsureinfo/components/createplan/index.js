import React from "react";
import Group from "tuns-mobile/lib/form/group";
import Modal from "tuns-mobile/lib/form/modal";
import MoreSelect from "../moreselect";
import PersonType from "../persontype";
import { ProfessionAmountRule } from "../../../../insrules/professionamountrule";

import styles from "./index.less";

const Info = props => {
  const { data } = props;
  let msg = "";
  const lastIndex = data.length - 1;
  data.forEach((item, index) => {
    msg += `${item.liabilityName + item.insuredAmountText}`;
    if (index === lastIndex) {
      msg += "。";
    } else {
      msg += "；";
    }
  });
  return (
    <div className={styles.planInfo}>
      <p>{msg}</p>
    </div>
  );
};

class CreatePlan extends React.Component {
  render() {
    let { itemKindsSupport } = this.props;
    const {
      productInfo,
      title,
      showRemove,
      onRemove,
      itemKinds,
      professionSupport,
      professionClassify,
      professions,
      elementIndex,
      dispatch,
      onPlanChange,
      planData,
      onCaculate,
      ...formProps
    } = this.props;
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
    const currentProfessionSupport = ProfessionAmountRule(
      planData,
      itemKindsSupportTemp,
      professionSupport
    ).professionSupport;
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
      <Group
        {...formProps}
        title={
          <>
            <div className="am-card-header-content am-card-header-content-title">
              {title}
            </div>
            <p className={styles.more}>{professionMsg}</p>
          </>
        }
        classname={styles.root}
        headerExtra={
          showRemove ? (
            <div className={styles.action} onClick={onRemove}>
              <a>删除</a>
            </div>
          ) : null
        }
      >
        <Modal
          name={`plan__${elementIndex}`}
          title="当前计划"
          buttonText="修改保障计划"
          defaultValue={itemKinds.length > 0 ? "1" : null}
          rules={[
            {
              required: true,
              message: `${title}没有选择责任`,
            },
          ]}
        >
          <MoreSelect
            planData={planData}
            professionSupport={professionSupport}
            currentProfessionSupport={currentProfessionSupport}
            productInfo={productInfo}
            data={[
              {
                id: "1",
                value: "1",
                name: "已选择",
              },
            ]}
            professionClassify={professionClassify}
            itemKindsSupport={itemKindsSupport}
            itemKinds={itemKinds}
            enter={() => {
              this.setState({}, () => {
                if (onPlanChange) {
                  onPlanChange(formProps.form, itemKinds);
                }
              });
            }}
          />
        </Modal>
        {itemKinds.length > 0 ? <Info data={itemKinds} /> : <></>}
        <PersonType
          onCaculate={onCaculate}
          data={professions}
          planTitle={title}
          planData={planData}
          itemKindsSupport={itemKindsSupport}
          professionSupport={professionSupport}
        />
      </Group>
    );
  }
}

export default CreatePlan;
