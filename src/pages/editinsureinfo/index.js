import React from "react";
import { connect } from "dva";
import Tabs from "tuns-mobile/lib/tabs";
import { Icon, Toast } from "antd-mobile";
import NoticeBar from "tuns-mobile/lib/noticebar";
import { storage } from "tuns-utils";
import { TSRouter as router } from "../../tools/router";
import styles from "./index.less";
import Plan from "./components/plan";
import Info from "./components/info";
import Action from "./components/bottomaction";
import BaseController from "../../components/controller";

@connect(store => ({
  productInfo: store.proposalSaveSpace.productInfo,
  productInfo2: store.proposalSaveSpace.productInfo2,
  proposalSaveInfo: store.proposalSaveSpace.proposalSaveInfo,
}))
class EditInsureInfoPage extends BaseController {
  state = {
    currentTabIndex: 0,
  };

  componentDidMount() {
    this.setTitle("填写投保资料");
    const { dispatch, location } = this.props;
    const { query } = location;
    const { productCode, proposalNumber, storageNumber, premiumNumber } = query;
    dispatch({
      type: "proposalSaveSpace/loadProductInsureInfo",
      payload: { productCode, premiumNumber },
    }).then(() => {
      dispatch({
        type: "proposalSaveSpace/loadProductInfo",
        payload: { productCode },
      }).then(() => {
        if (proposalNumber && proposalNumber.length > 0) {
          dispatch({
            type: "proposalSaveSpace/loadProposalInfo",
            payload: { proposalNumber },
          });
        } else if (storageNumber && storageNumber.length > 0) {
          dispatch({
            type: "proposalSaveSpace/loadProposalInfo",
            payload: { proposalNumber: storageNumber },
          });
        } else {
          const proposalInfoStr = storage.get("K_PROPOSAL_INFO");
          if (proposalInfoStr) {
            try {
              const proposalInfo = JSON.parse(proposalInfoStr);
              dispatch({
                type: "proposalSaveSpace/updateProposalSaveInfo",
                payload: proposalInfo,
              });
              // eslint-disable-next-line no-empty
            } catch (e) {}
            storage.set("K_PROPOSAL_INFO", undefined);
          }
        }
      });
    });

    dispatch({
      type: "appSpace/updateNavBarRightIcons",
      payload: [
        {
          text: "帮我录单",
          onClick: () => {
            const { productInfo2 } = this.props;
            const { base } = productInfo2;
            const { productName, insTypeId, insTypeName } = base;
            router.push({
              pathname: `/record`,
              query: { productCode, productName, insTypeId, insTypeName },
            });
          },
        },
      ],
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "proposalSaveSpace/clearState",
    });

    dispatch({
      type: "appSpace/updateNavBarRightIcons",
      payload: [],
    });
  }

  storageAction = complete => {
    const { dispatch } = this.props;
    const planValues = this.planForm.getFieldsValue();
    const infoValues = this.infoForm.getFieldsValue();
    // 暂存
    dispatch({
      type: "proposalSaveSpace/proposalSave",
      payload: {
        plan: planValues,
        info: infoValues,
        storage: "1",
      },
    }).then(response => {
      if (response) {
        // Toast.success("暂存成功", 2);
        complete();
      }
    });
  };

  localOnClick = storageFlag => {
    const { currentTabIndex } = this.state;
    const { dispatch } = this.props;
    if (storageFlag === "1") {
      const planValues = this.planForm.getFieldsValue();
      const infoValues = this.infoForm.getFieldsValue();
      // 暂存
      dispatch({
        type: "proposalSaveSpace/proposalSave",
        payload: {
          plan: planValues,
          info: infoValues,
          storage: storageFlag,
        },
      }).then(response => {
        if (response) {
          Toast.success("暂存成功", 2);
          dispatch({
            type: "proposalSaveSpace/loadProposalInfo",
            payload: { proposalNumber: response.proposalNumber },
          });
        }
      });
      return;
    }
    if (currentTabIndex === 1) {
      this.planForm.validateFields((error, values) => {
        if (error == null) {
          this.infoForm.validateFields((infoError, infoValues) => {
            if (infoError == null) {
              if (!this.agreement) {
                Toast.fail("请勾选已阅读《投保须知》和《产品条款》！", 2);
                return;
              }
              // 保费试算
              dispatch({
                type: "proposalSaveSpace/premiumCaculate",
                payload: { form: this.planForm, storage: "0" },
              }).then(response => {
                if (response) {
                  // 投保
                  dispatch({
                    type: "proposalSaveSpace/proposalSave",
                    payload: {
                      plan: values,
                      info: infoValues,
                      storage: storageFlag,
                    },
                  }).then(proposalSaveResponse => {
                    if (proposalSaveResponse) {
                      router.push(
                        `/confirminsure?proposalNumber=${proposalSaveResponse.proposalNumber}`
                      );
                    }
                  });
                }
              });
            } else {
              const key = Object.keys(infoError)[0];
              const { errors } = infoError[key];
              const { message } = errors[0];
              Toast.fail(message, 2);
            }
          });
        } else {
          const key = Object.keys(error)[0];
          const { errors } = error[key];
          const { message } = errors[0];
          Toast.fail(message, 2);
        }
      });
    } else {
      this.planForm.validateFields(error => {
        if (error) {
          const key = Object.keys(error)[0];
          const { errors } = error[key];
          const { message } = errors[0];
          Toast.fail(message, 2);
        } else {
          const eve = document.createEvent("Event");
          eve.initEvent("click", true, false);
          const ele = document.querySelector(".am-tabs-default-bar-content")
            .children[1];
          if (ele && ele.dispatchEvent) {
            ele.dispatchEvent(eve);
          } else {
            // tab dom没获取到。只要页面上不会出现  两个tabs，就不会出现这个情况
          }
        }
      });
    }
  };

  onChange = (_, index) => {
    this.setState({ currentTabIndex: index });
  };

  render() {
    const { currentTabIndex } = this.state;
    const { productInfo2 } = this.props;
    const tabsData = [{ title: "完善保障计划" }, { title: "完善投保人信息" }];
    return (
      <div className={styles.root}>
        <NoticeBar
          action={<Icon type="icontsgb" size="xxs" />}
          mode="closable"
          icon={
            <Icon type="iconzyts" size="xxs" color="rgba(251, 112, 55, 1)" />
          }
          isbreak={1}
          marqueeProps={{
            loop: false,
            style: { padding: "14px 7.5px", whiteSpace: "normal" },
          }}
          content="为了保障您的权益，请填写真实有效的信息。填写内容仅供投保使用，对于您的信息我们会严格保密。"
        />
        <Tabs
          tabs={tabsData}
          onChange={this.onChange}
          useOnPan={false}
          swipeable={false}
        >
          <Plan
            getForm={form => {
              this.planForm = form;
            }}
          />
          <Info
            getForm={form => {
              this.infoForm = form;
            }}
            onChangeAgreement={value => {
              this.agreement = value;
            }}
            productInfo2={productInfo2}
            storageAction={this.storageAction}
          />
        </Tabs>
        <Action
          onNextClick={() => {
            this.localOnClick("0");
          }}
          onStorageClick={() => {
            this.localOnClick("1");
          }}
          currentTabIndex={currentTabIndex}
        />
      </div>
    );
  }
}

export default EditInsureInfoPage;
