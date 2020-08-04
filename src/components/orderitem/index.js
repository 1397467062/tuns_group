import React from "react";
import { Button, ActionSheet, Toast } from "antd-mobile";
import p from "tuns-class-prefix";
import PropTypes from "prop-types";
import { TSRouter as router } from "../../tools/router";
import "./index.less";

const CLS_PREFIX = "tuns-group-orderitem";
const addPrefix = p(CLS_PREFIX);

const showActionSheet = () => {
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

const detail = (productCode, premiumNumber) => {
  router.push({
    pathname: "/premiumtrialdetail",
    query: { productCode, premiumNumber },
  });
};

const againIns = id => {
  router.push(`/detail?productCode=${id}`);
};

const resultInfo = id => {
  router.push(`/quoteresult?premiumBatchNumber=${id}`);
};

const pay = (orderUuid, dispatch) => {
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

/**
 *
 * @param {string} time 起保时间
 * @param {number} status 订单状态
 * @param {string} img 图片网址
 * @param {string} title 标题
 * @param {number} money 金额
 * @param {number} promote 推广费
 * @param {number} people 人数
 * @param {string} date 时间段
 * @param {string} type 类型判断
 * @param {fun} onGoDetail 查看详情方法
 */

const OrderItem = ({ item, onGoDetail, type, dispatch }) => {
  const {
    time,
    status,
    img,
    title,
    money,
    promote,
    date,
    people,
    id,
    productId,
    inqBasicId,
    orderUuid,
  } = item;
  return (
    <div className={addPrefix("wrap")}>
      <div className={addPrefix("header")}>
        <div style={{ color: "#333333" }}>{time}</div>
        <div style={{ color: "#666666" }}>{renderStatus(status, type)}</div>
      </div>
      <div
        className={addPrefix("content")}
        onClick={onGoDetail.bind(null, item.inqBasicId)}
      >
        <img src={img} alt="" className={addPrefix("img")} />
        <div className={addPrefix("item")}>
          <p className={addPrefix("title")}>{title}</p>
          <p>{`保险期限: ${date}`}</p>
          <p>{`保障人数: ${people}人`}</p>
        </div>
      </div>
      <div className={addPrefix("money")}>
        {promote ? <div>{`推广费：${promote.toFixed(2)}元`}</div> : <div />}
        {money ? <div>{`总保费：${money.toFixed(2)}元`}</div> : <div />}
      </div>
      <div className={addPrefix("buttonBox")}>
        {renderButton(
          status,
          type,
          id,
          productId,
          inqBasicId,
          orderUuid,
          dispatch,
          onGoDetail
        )}
      </div>
    </div>
  );
};

// 总体报价状态(1-报价等待,2-报价成功,3-报价失败,4-报价关闭)
const renderStatus = (status, type) => {
  if (type === "price") {
    switch (status) {
      case "1":
        return <span>报价等待</span>;
      case "2":
        return <span>报价成功</span>;
      case "3":
        return <span>报价失败</span>;
      case "4":
        return <span>报价关闭</span>;
      default:
        return <span>未知状态</span>;
    }
  } else if (type === "order") {
    switch (status) {
      case "G1":
        return <span>等待支付</span>;
      case "G2":
        return <span>支付成功</span>;
      case "G3":
        return <span>支付失败</span>;
      case "G4":
        return <span>订单关闭</span>;
      default:
        return <span>未知状态</span>;
    }
  }
};
const renderButton = (
  status,
  type,
  id,
  productId,
  inqBasicId,
  orderUuid,
  dispatch,
  onGoDetail
) => {
  if (type === "price") {
    switch (status) {
      case "1":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={detail.bind(this, productId, inqBasicId)}
            >
              详情
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={showActionSheet}
            >
              联系客服
            </Button>
          </>
        );
      case "2":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={resultInfo.bind(this, inqBasicId)}
            >
              报价结果
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={detail.bind(this, productId, inqBasicId)}
            >
              详情
            </Button>
            <Button size="small" inline className={addPrefix("button")}>
              立即投保
            </Button>
          </>
        );
      case "3":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={detail.bind(this, productId, inqBasicId)}
            >
              详情
            </Button>
            <Button size="small" inline className={addPrefix("button")}>
              重新询价
            </Button>
          </>
        );
      case "4":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={detail.bind(this, productId, inqBasicId)}
            >
              详情
            </Button>
            <Button size="small" inline className={addPrefix("button")}>
              重新询价
            </Button>
          </>
        );
      default:
        return null;
    }
  } else if (type === "order") {
    switch (status) {
      case "G1":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={onGoDetail.bind(null, inqBasicId)}
            >
              详情
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={againIns.bind(this, productId)}
            >
              重新投保
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={pay.bind(this, orderUuid, dispatch)}
            >
              立即支付
            </Button>
          </>
        );
      case "G2":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={showActionSheet}
            >
              联系客服
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={onGoDetail.bind(null, inqBasicId)}
            >
              详情
            </Button>
          </>
        );
      case "G3":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={onGoDetail.bind(null, inqBasicId)}
            >
              详情
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={showActionSheet}
            >
              联系客服
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={againIns.bind(this, productId)}
            >
              重新投保
            </Button>
          </>
        );
      case "G4":
        return (
          <>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={onGoDetail.bind(null, inqBasicId)}
            >
              详情
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={showActionSheet}
            >
              联系客服
            </Button>
            <Button
              size="small"
              inline
              className={addPrefix("button")}
              onClick={againIns.bind(this, productId)}
            >
              重新投保
            </Button>
          </>
        );
      default:
        return null;
    }
  }
};

OrderItem.propTypes = {
  item: PropTypes.object.isRequired,
  onGoDetail: PropTypes.func,
  type: PropTypes.string.isRequired,
};

OrderItem.defaultProps = {
  onGoDetail: () => {},
};

export default OrderItem;
