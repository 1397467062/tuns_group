import React from "react";
import { connect } from "dva";
import { containerAction } from "../../../../utils";
import InsList from "../list";
import Table from "../table";

@connect(store => ({ quoteresult: store.quoteresult }))
class DataResult extends React.Component {
  state = {
    open: true,
  };

  componentDidMount() {
    const { dispatch, inqBasicId } = this.props;
    dispatch({
      type: "quoteresult/getResult",
      payload: { inqBasicId },
    });
    dispatch({
      type: "quoteresult/getCostTotal",
      payload: { inqBasicId },
    });
    this.eyes();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: "appSpace/updateNavBarRightIcons",
      payload: [],
    });
  }

  eyes = () => {
    const { open } = this.state;
    const { props } = this;
    const { dispatch } = props;
    const { SystemTuns = false } = window.TUNS_GLOBAL || {};
    const rightPayload = [
      {
        icon: open ? "iconyj" : "iconby",
        onClick: () => {
          this.setState({ open: !open }, () => {
            this.eyes();
          });
        },
      },
    ];
    if (SystemTuns) {
      rightPayload.push({
        icon: "iconfx",
        onClick: () => {
          this.share();
        },
      });
    }
    dispatch({
      type: "appSpace/updateNavBarRightIcons",
      payload: rightPayload,
    });
  };

  share = () => {
    const { quoteresult, dispatch, inqBasicId } = this.props;
    const planId = [];
    quoteresult.columns.forEach(item => {
      planId.push(item.planId);
    });

    dispatch({
      type: "quoteresult/getShare",
      payload: {
        shareType: "1",
        shareParams: {
          premiumNumber: JSON.stringify(planId),
          premiumBatchNumber: inqBasicId,
        },
      },
    }).then(res => {
      const { response, data } = res;
      if (response.head.messageCd === "0000") {
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
    const { quoteresult } = this.props;
    const {
      datas,
      columns,
      costTotal,
      totalnum,
      premAmounts,
      opendatas,
    } = quoteresult;
    const { open } = this.state;
    return (
      <>
        {datas && datas.length ? (
          <Table columns={columns} datas={open ? opendatas : datas} />
        ) : null}
        <InsList
          costTotal={costTotal}
          totalnum={totalnum}
          premAmounts={premAmounts}
        />
      </>
    );
  }
}
export default DataResult;
