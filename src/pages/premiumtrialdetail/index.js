import React from "react";
import { connect } from "dva";
import CustomText from "tuns-mobile/lib/customtext";
import { TSRouter as router } from "../../tools/router";
import styles from "./index.less";
import ParameterList from "./component/parameterList";
import Plan from "./component/plan";
import Tabs from "./component/tabs";
import Action from "./component/bottomaction";
import BaseController from "../../components/controller";

@connect(store => ({
  premiumTrialDetailSpace: store.premiumTrialDetailSpace,
}))
class PremiumTrialDetail extends BaseController {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  componentDidMount() {
    this.setTitle("");
    const { dispatch, location } = this.props;
    const { query } = location;
    const { productCode, premiumNumber } = query;
    dispatch({
      type: "premiumTrialDetailSpace/loadProductInfo",
      payload: { productCode },
    }).then((responseData = {}) => {
      const { base = {} } = responseData;
      this.setTitle(base.productName);
    });
    dispatch({
      type: "premiumTrialDetailSpace/loadProductInsureInfo",
      payload: { productCode },
    });
    if (premiumNumber && premiumNumber.length > 0) {
      dispatch({
        type: "premiumTrialDetailSpace/premiumTrialDetail",
        payload: { premiumNumber },
      });
    }
  }

  render() {
    const { state } = this;
    const { props } = this;
    const { page } = state;
    const { premiumTrialDetailSpace } = props;
    const { productInfo, premiumTrialDetail } = premiumTrialDetailSpace;
    const parametersValues = premiumTrialDetail.parameters;
    const plansValue = premiumTrialDetail.plans || [];
    const baseValue = premiumTrialDetail.base || {};

    const premium = baseValue.premium || 0;
    const newPremium = premium.toFixed(2);
    const premiumText = newPremium.toString();
    const premiumArray = premiumText.split(".");

    const { parameters } = productInfo;
    const itemKinds = productInfo.itemKinds || [];
    const itemKindsDic = {};
    itemKinds.forEach(itemKindItem => {
      itemKindsDic[itemKindItem.liabilityCode] = itemKindItem;
    });

    return (
      <div className={styles.root}>
        <ParameterList
          parametersValues={parametersValues || {}}
          parameters={parameters || []}
        />
        {plansValue.map((planItem, index) => (
          <Plan
            key={planItem.order || index}
            plan={planItem}
            itemKindsDic={itemKindsDic}
          />
        ))}
        <div className={styles.premium}>
          <div className={styles.premium_text}>预计总保费：</div>
          <div className={styles.money}>
            <span>{premiumArray[0]}</span>
            <span className={styles.money_decimals}>
              {`.${premiumArray[1]}元`}
            </span>
          </div>
        </div>
        <CustomText
          customRender={(text, index) => {
            const eventText = {
              "《特别告知》": () => {
                this.setState({ page: 1 });
              },
              "《产品条款》": () => {
                this.setState({ page: 2 });
              },
            };
            const array = Object.keys(eventText);
            for (let i = 0; i < array.length; i += 1) {
              const key = array[i];
              if (text === key) {
                return (
                  <a key={`custom_text_${index}`} onClick={eventText[key]}>
                    {text}
                  </a>
                );
              }
            }
            return text;
          }}
        >
          请仔细阅读 《特别告知》 和 《产品条款》
        </CustomText>
        <Tabs
          productInfo={productInfo}
          page={page}
          onChange={(title, pageIndex) => {
            this.setState({ page: pageIndex });
          }}
        />
        <Action
          premium={premium}
          onNextClick={() => {
            const { base = {} } = productInfo;
            router.push(`/editinsureinfo?productCode=${base.productCode}`);
          }}
        />
      </div>
    );
  }
}

export default PremiumTrialDetail;
