import React from "react";
import { Modal, Toast } from "antd-mobile";
import Button from "tuns-mobile/lib/button";
import PropTypes from "prop-types";
import { isEmpty } from "tuns-utils";
import { TSRouter as router } from "../../../../tools/router";
import styles from "./index.less";

const { alert } = Modal;

const showAlert = (dispatch, insBasicId, onDelet) => {
  alert("确定删除？", null, [
    { text: "取消" },
    {
      text: "确定",
      onPress: () =>
        dispatch({
          type: "pending/deleteInfo",
          payload: {
            insBasicId,
            delFlag: 1,
          },
        }).then(res => {
          const { response } = res;
          const { messageCd, messageInf } = response.head;
          if (messageCd === "0000") {
            onDelet();
            Toast.success("删除成功");
          } else {
            Toast.info(messageInf);
          }
        }),
    },
  ]);
};

// 投保信息页
const goInsInfo = (id, insBasicId, orderStatus) => {
  if (orderStatus === "G0") {
    router.push(`/confirminsure?proposalNumber=${insBasicId}`);
  } else {
    router.push(
      `/editinsureinfo?productCode=${id}&storageNumber=${insBasicId}`
    );
  }
};

// 产品详情页
const goDetail = id => {
  router.push(`/detail?productCode=${id}`);
};

const filterImg = img => {
  if (isEmpty(img) || typeof img !== "object" || img.length === 0) {
    return "";
  }
  return JSON.parse(img[0])[0].fileUrl;
};

/**
 *
 * @param {string} creTm 创建时间
 * @param {number} insBasicId 投保订单编号
 * @param {string} productUrl 图片地址
 * @param {string} productName 产品名称
 * @param {string} startDate 起始时间
 * @param {string} endDate 终止时间
 * @param {number} premAmount 总保费
 */

const OrderItem = ({ item, dispatch, onDelet }) => {
  const {
    creTm,
    leftProdImg,
    productName,
    premAmount,
    insBasicId,
    startDate,
    endDate,
    productId,
    orderStatus,
  } = item;
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>{creTm}</div>
      </div>
      <div className={styles.body}>
        <img
          src={
            filterImg(leftProdImg) ||
            "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png"
          }
          alt=""
          className={styles.img}
        />
        <div
          className={styles.content}
          onClick={goDetail.bind(null, productId)}
        >
          <p className={styles.title}>{productName}</p>
          <p className={styles.time}>{`保险期间:${startDate}至${endDate}`}</p>
        </div>
      </div>
      <div className={styles.footer}>
        <p>{`预计总保费：${premAmount.toFixed(2)}`}</p>
        <div className={styles.button}>
          <Button
            type="primary"
            isShadow={false}
            isActive
            className={styles.delete}
            onClick={() => {
              showAlert(dispatch, insBasicId, onDelet);
            }}
          >
            删除订单
          </Button>
          <Button
            type="primary"
            isShadow={false}
            isActive
            onClick={goInsInfo.bind(null, productId, insBasicId, orderStatus)}
          >
            {orderStatus === "G0" ? `投保确认` : `继续填写`}
          </Button>
        </div>
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  item: PropTypes.shape({
    creTm: PropTypes.string,
    productUrl: PropTypes.string,
    productName: PropTypes.string,
    premAmount: PropTypes.number,
    insBasicId: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};
OrderItem.defaultProps = {
  item: PropTypes.shape({
    creTm: "",
    productUrl: "",
    productName: "",
    premAmount: 0,
    insBasicId: 0,
    startDate: "",
    endDate: "",
  }),
};
export default OrderItem;
