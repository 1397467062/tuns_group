import React from "react";
import { connect } from "dva";
import OrderButton from "tuns-mobile/lib/orderbutton";
import { List, ActionSheet, Toast } from "antd-mobile";
import { TSRouter as router } from "../../tools/router";
import Order from "./components/header";
import DetailCard from "./components/card";
import RightsCard from "./components/rightscard";
import styles from "./index.less";
import { trimOrdersDetailData, plansData, baseinfo } from "./service/filter";
import BaseController from "../../components/controller";
import { containerAction } from "../../utils";

@connect(store => ({ orderDetail: store.orderdetail }))
class OrderDemo extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const { proposalNumber } = query;
    this.state = {
      status: 0, // 0-等待支付,1-支付成功,2-订单关闭
      money: 0,
      scale: 2,
      id: proposalNumber,
    };
  }

  componentDidMount() {
    this.setTitle("订单详情");
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: "orderdetail/getDetailData",
      payload: { insBasicId: id },
    }).then(() => {
      const { orderDetail } = this.props;
      const basedata = baseinfo(orderDetail.data);
      this.setState({
        status: basedata.state,
        money: basedata.premAmount,
      });
    });
  }

  insure = productId => {
    router.push(`/detail?productCode=${productId}`);
  };

  pay = orderUuid => {
    const { dispatch } = this.props;
    Toast.loading();
    dispatch({ type: "confirm/paymentApply", payload: { orderUuid } }).then(
      info => {
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
      }
    );
  };

  share = (proposalNumber, orderNumber) => {
    const { dispatch } = this.props;
    Toast.loading();
    dispatch({
      type: "orderdetail/shareDetail",
      payload: { shareType: "4", shareParams: { proposalNumber, orderNumber } },
    }).then(res => {
      const { response, data } = res;
      if (response.head.messageCd === "0000") {
        Toast.hide();
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

  renderBottom = (productId, orderNumber, insBasicId) => {
    const { status } = this.state;

    let leftText = "";
    let rightText = "";
    let leftClick = () => {};
    let rightClick = () => {};
    switch (status) {
      case 0:
        leftText = "重新投保";
        rightText = "立即支付";
        leftClick = () => this.insure(productId);
        rightClick = () => this.pay(orderNumber);
        break;
      case 1:
        leftText = "联系客服";
        rightText = "分享给客户";
        leftClick = () => this.onsever();
        rightClick = () => this.share(insBasicId, orderNumber);
        break;
      case 2:
        leftText = "联系客服";
        rightText = "重新投保";
        leftClick = () => this.onsever();
        rightClick = () => this.insure(productId);
        break;
      case 3:
        leftText = "联系客服";
        rightText = "重新投保";
        leftClick = () => this.onsever();
        rightClick = () => this.insure(productId);
        break;
      default:
    }
    return (
      <OrderButton
        leftText={leftText}
        rightText={rightText}
        leftClick={leftClick}
        rightClick={rightClick}
      />
    );
  };

  render() {
    const { TUNS_GLOBAL } = window;
    const { SystemTuns } = TUNS_GLOBAL;
    const { status, money, scale } = this.state;
    const { orderDetail } = this.props;
    const { data } = orderDetail;
    const { appBasic = {}, productId = "", insBasicId = "" } = data;
    const { tsOrderNo = "" } = appBasic;
    const { listData } = trimOrdersDetailData(data);
    const guan = plansData(data);
    return (
      <div className={styles.main}>
        <Order status={status} money={money} scale={scale} />
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
        {SystemTuns && this.renderBottom(productId, tsOrderNo, insBasicId)}
      </div>
    );
  }
}
export default OrderDemo;
