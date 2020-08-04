import React from "react";
import { connect } from "dva";
import { Toast } from "antd-mobile";
import Header from "./component/head";
import Conditions from "./component/conditions";
import { containerAction } from "../../utils";

import styles from "./index.less";
import BaseController from "../../components/controller";

@connect(store => ({ detailData: store.detail }))
class Detail extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const { productCode } = query;
    this.state = {
      productId: productCode,
    };
  }

  componentDidMount() {
    this.setTitle("");
    const { dispatch } = this.props;

    const { productId } = this.state;
    dispatch({
      type: "detail/insGroupDetails",
      payload: { productId },
    }).then(() => {
      const { detailData } = this.props;
      const { detailInfo = {} } = detailData;
      this.setTitle(detailInfo.productName);
    });

    const { SystemTuns = false } = window.TUNS_GLOBAL || {};
    if (SystemTuns) {
      dispatch({
        type: "appSpace/updateNavBarRightIcons",
        payload: [
          {
            icon: "iconfx",
            onClick: () => {
              const { detailData } = this.props;
              const { checkedProject } = detailData;
              const { planId } = checkedProject;
              this.share(planId);
            },
          },
        ],
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "detail/clear" });

    dispatch({
      type: "appSpace/updateNavBarRightIcons",
      payload: [],
    });
  }

  share = () => {
    const { dispatch } = this.props;
    const { productId } = this.state;
    dispatch({
      type: "detail/shareDetail",
      payload: { shareType: "2", shareParams: { productCode: productId } },
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

  render() {
    const { detailData, dispatch } = this.props;
    const { detailInfo, isEnd, images, profession } = detailData;
    const { productName, brief } = detailInfo;
    return (
      <div className={styles.root}>
        <Header
          img={isEnd ? images["05"][0] : ""}
          title={productName}
          brief={brief}
        />
        {isEnd && (
          <>
            <Conditions
              info={detailData}
              dispatch={dispatch}
              profession={profession}
            />
          </>
        )}
      </div>
    );
  }
}

export default Detail;
