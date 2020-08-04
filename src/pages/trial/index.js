import React from "react";
import { connect } from "dva";
import { storage } from "tuns-utils";
import { TSRouter as router } from "../../tools/router";
import styles from "./index.less";
import Plan from "./components/plan";
import Action from "./components/bottomaction";
import BaseController from "../../components/controller";
import { containerAction } from "../../utils";

@connect(store => ({
  productInfo: store.proposalTrialSpace.productInfo,
  proposalTrialInfo: store.proposalTrialSpace.proposalTrialInfo,
  premium: store.proposalTrialSpace.premium,
}))
class TrialPage extends BaseController {
  componentDidMount() {
    this.setTitle("保费试算");
    const { dispatch, location } = this.props;
    const { query } = location;
    const { productCode } = query;
    dispatch({
      type: "proposalTrialSpace/loadProductInfo",
      payload: { productCode },
    }).then(() => {
      const proposalInfoStr = storage.get("K_PROPOSAL_INFO");
      if (proposalInfoStr) {
        try {
          const proposalInfo = JSON.parse(proposalInfoStr);
          dispatch({
            type: "proposalTrialSpace/updateProposalTrialInfo",
            payload: proposalInfo,
          });
          // eslint-disable-next-line no-empty
        } catch (e) {}
        storage.set("K_PROPOSAL_INFO", undefined);
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "proposalTrialSpace/clearState",
    });
  }

  render() {
    const { dispatch, premium, location } = this.props;
    const { query } = location;
    const { productCode } = query;
    return (
      <div className={styles.root}>
        <Plan
          getForm={form => {
            this.planForm = form;
          }}
        />
        <Action
          premium={premium}
          onNextClick={() => {
            dispatch({
              type: "proposalTrialSpace/premiumCaculate",
              payload: { form: this.planForm, storage: "2" },
            }).then(() => {
              router.push(`/editinsureinfo?productCode=${productCode}`);
            });
          }}
          onStorageClick={() => {
            // 保费试算
            dispatch({
              type: "proposalTrialSpace/premiumCaculate",
              payload: { form: this.planForm, storage: "1" },
            }).then(response => {
              if (response && response.premiumNumber) {
                dispatch({
                  type: "proposalTrialSpace/share",
                  payload: {
                    shareType: "3",
                    shareParams: {
                      productCode,
                      premiumNumber: response.premiumNumber,
                    },
                  },
                }).then(res => {
                  const { response: responseData, data } = res;
                  if (responseData.head.messageCd === "0000") {
                    const { title, url, logo, content } = data;
                    const obj = {
                      title,
                      image: logo,
                      url,
                      text: content,
                      share: "1",
                    };
                    containerAction("tunsShareAction", JSON.stringify(obj));
                  }
                });
              }
            });
          }}
        />
      </div>
    );
  }
}

export default TrialPage;
