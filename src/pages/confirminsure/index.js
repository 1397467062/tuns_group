import React from "react";
import { connect } from "dva";
import { List, ActionSheet, Icon, Toast } from "antd-mobile";
import Bottom from "tuns-mobile/lib/bottom";
import DetailCard from "./components/card";
import RightsCard from "./components/rightscard";
import styles from "./index.less";
import { trimOrdersDetailData, plansData } from "./service/filter";
import BaseController from "../../components/controller";

@connect(store => ({ confirm: store.confirm }))
class ConfirmIns extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const { proposalNumber } = query;
    this.state = {
      insBasicId: proposalNumber,
    };
  }

  componentDidMount() {
    this.setTitle("投保确认");
    const { dispatch } = this.props;
    const { insBasicId } = this.state;
    dispatch({
      type: "confirm/groupInsure",
      payload: { insBasicId },
    });
  }

  insure = () => {
    const { dispatch } = this.props;
    const { insBasicId } = this.state;
    dispatch({
      type: "confirm/confirmInsure",
      payload: { insBasicId },
    }).then(res => {
      const { data, response } = res;
      const { head } = response;
      if (head.messageCd === "0000") {
        dispatch({
          type: "confirm/paymentApply",
          payload: { orderUuid: data.orderNumber },
        }).then(info => {
          Toast.hide();
          if (!info) {
            Toast.fail("提交表单异常，请稍候再试");
            return;
          }
          if (info.paymentUrl) {
            window.location.href = info.paymentUrl;
          } else {
            Toast.fail(info.response.head.messageInf);
          }
        });
      } else {
        Toast.fail(head.messageInf);
      }
    });
  };

  onsever = () => {
    const BUTTONS = [
      "客服工作时间：工作日08:30~17:30",
      "拨打客服热线 4000-1936-00",
      "取消",
    ];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        maskClosable: true,
      },
      buttonIndex => {
        if (buttonIndex === 1) window.location.href = "tel:4000193600";
      }
    );
  };

  leftRender = () => (
    <div className={styles.button} onClick={this.onsever}>
      <Icon type="iconkf" size="md" color="#999" />
      <p>客服</p>
    </div>
  );

  render() {
    const { confirm } = this.props;
    const { data } = confirm;
    const { listData } = trimOrdersDetailData(data);
    const guan = plansData(data);
    return (
      <div className={styles.main}>
        <List className={styles.content}>
          {listData.slice(0, 1).map(item => (
            <DetailCard data={item} key={item.id} />
          ))}
          {guan.map((item, index) => (
            <RightsCard
              key={`000${index}`}
              info={item}
              title={`保障权益${index + 1}`}
            />
          ))}

          {listData.slice(1, 4).map(item => (
            <DetailCard data={item} key={item.id} />
          ))}
        </List>
        <Bottom
          total={data.appBasic ? data.appBasic.premAmount : 0}
          buttonText="确认订单"
          buttonClick={this.insure}
          leftRender={this.leftRender}
          scale={2}
          organization
          totalUnit="元"
        />
      </div>
    );
  }
}
export default ConfirmIns;
