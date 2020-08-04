import React from "react";
import { connect } from "dva";
import { SearchBar, Icon } from "antd-mobile";
import ListScroll from "tuns-mobile/lib/listscroll";
import NoticeBar from "tuns-mobile/lib/noticebar";
import { equals } from "tuns-utils";
import UITab from "tuns-mobile/lib/tabs";
import { TSRouter as router } from "../../tools/router";
import OrderItem from "../../components/orderitem";
import NoData from "../../components/nodata";
import styles from "./index.less";
import BaseController from "../../components/controller";

@connect(store => ({ orderData: store.order }))
class OrderList extends BaseController {
  constructor(props) {
    super(props);
    this.state = {
      orderName: "",
      pageNum: 1,
      orderStatus: "G1,G2,G3,G4",
    };

    this.listRef = React.createRef();
  }

  componentDidMount() {
    this.setTitle("订单列表");
    this.getOrders();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { orderName } = this.state;
    const { orderData } = this.props;
    return (
      !equals(orderData, nextProps.orderData) ||
      !equals(orderName, nextState.orderName)
    );
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "order/clear" });
  }

  onTabChange = async (_, index) => {
    const query = {
      pageNum: 1,
    };
    if (index === 0) {
      query.orderStatus = "G1,G2,G3,G4";
    } else if (index === 1) {
      query.orderStatus = "G1";
    } else if (index === 2) {
      query.orderStatus = "G2";
    }

    await this.setState(state => ({ ...state, ...query }));
    this.getOrders();
  };

  getOrders = (clear = true) => {
    const { dispatch } = this.props;
    const { orderName, pageNum, orderStatus } = this.state;
    const query = {
      page: {
        displayNum: 8,
        curPageNum: pageNum + 1,
      },
      productName: orderName,
      orderStatus,
    };
    if (clear) {
      this.listRef.current.scrollTop = 0;
      query.page.curPageNum = 1;
    }

    dispatch({ type: "order/getOrders", payload: query, clear }).then(() => {
      this.setState({
        pageNum: query.page.curPageNum,
      });
    });
  };

  onChangeSearch = value => {
    this.setState({ orderName: value });
  };

  onGoDetail = (id, orderNumber) => {
    router.push({
      pathname: "/orderdetail",
      query: { proposalNumber: id, orderNumber },
    });
  };

  render() {
    const { orderName } = this.state;
    const { orderData, dispatch } = this.props;
    const { orderList, totalNum, isEnd } = orderData;
    const tabs = [{ title: "全部" }, { title: "待付款" }, { title: "已付款" }];
    return (
      <div className={styles.root}>
        <NoticeBar
          action={<Icon type="icontsgb" size="xxs" />}
          mode="closable"
          icon={<Icon type="iconzyts" size="xxs" color="#ff7042" />}
          isbreak={1}
          marqueeProps={{
            loop: true,
            style: { padding: "14px 7.5px", whiteSpace: "normal" },
          }}
          content="未支付订单超过当日23:50未处理将自动取消，请尽快完成支付，如支付遇到问题，请联系客服"
        />
        <UITab tabs={tabs} onChange={this.onTabChange}>
          <>
            <SearchBar
              placeholder="请输入关键字"
              value={orderName}
              onChange={this.onChangeSearch}
              maxLength={12}
              onSubmit={this.getOrders.bind(this, true)}
            />
            <div className={styles.scroll} ref={this.listRef}>
              {isEnd && orderList.length === 0 ? (
                <NoData text="暂无数据" className={styles.nodata} />
              ) : (
                <ListScroll
                  onLoad={this.getOrders.bind(this, false)}
                  hasMore={orderList.length < totalNum}
                  initLoad
                >
                  {orderList.map((item, index) => {
                    return (
                      <OrderItem
                        item={item}
                        key={`${item.orderId}_${index}`}
                        onGoDetail={this.onGoDetail.bind(
                          this,
                          item.inqBasicId,
                          item.orderNumber
                        )}
                        dispatch={dispatch}
                        type="order"
                      />
                    );
                  })}
                </ListScroll>
              )}
            </div>
          </>
        </UITab>
      </div>
    );
  }
}

export default OrderList;
