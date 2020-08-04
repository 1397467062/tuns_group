import React from "react";
import { Button, Modal, Toast } from "antd-mobile";
import { connect } from "dva";
import copy from "copy-to-clipboard";
import { TSRouter as router } from "../../../../tools/router";
import styles from "./index.less";

@connect(store => ({ quoteresult: store.quoteresult }))
class UndataResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wechatId: "wxid_cg42b316uz0w22",
    };
  }

  // 复制

  copyWechat = () => {
    const { wechatId } = this.state;

    if (copy(wechatId)) {
      Toast.info("复制成功");
    } else {
      Toast.info("复制失败");
    }
  };

  // 返回修改

  onBack = () => {
    router.go(-1);
  };

  // 预约报价

  onQuote = () => {
    const { dispatch, inqBasicId } = this.props;
    dispatch({
      type: "quoteresult/getAppoint",
      payload: { inqBasicId },
    }).then(res => {
      if (res) {
        const { messageCd, messageInf = "" } = res;
        if (messageCd === "0000") {
          Modal.alert("预约报价申请已成功提交！", "", [
            {
              text: "确认",
              onPress: () => {},
              style: {
                fontSize: "0.28rem",
                fontFamily: "PingFangSC-Regular",
                color: "#FB7037",
              },
            },
          ]);
        } else {
          Toast.info(messageInf);
        }
      }
    });
  };

  render = () => {
    const { wechatId } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.header}>共有 0 家保险公司可承保</div>
        <div className={styles.body}>
          <div className={styles.img} />
          <div className={styles.title}>
            暂无匹配的产品，建议调整计划，或者定制团险方案
          </div>
          <div className={styles.btns}>
            <Button className={styles.backbtn} onClick={this.onBack}>
              返回修改
            </Button>
            <Button className={styles.quotebtn} onClick={this.onQuote}>
              预约报价
            </Button>
          </div>
        </div>
        <div className={styles.footer}>
          <div>温馨提示</div>
          <div>
            报价方案仅供参考，若您需要定制非车险方案，可联系我们的客服！
          </div>
          <div className={styles.wechat}>
            联系客服微信号：
            {wechatId}
            <Button className={styles.copybtn} onClick={this.copyWechat}>
              复制
            </Button>
          </div>
        </div>
      </div>
    );
  };
}

export default UndataResult;
