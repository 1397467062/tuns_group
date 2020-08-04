import React from "react";
import { connect } from "dva";
import { SearchBar, Icon } from "antd-mobile";
import ListScroll from "tuns-mobile/lib/listscroll";
import NoticeBar from "tuns-mobile/lib/noticebar";
import { equals } from "tuns-utils";
import { TSRouter as router } from "../../tools/router";
import OrderItem from "../../components/orderitem";
import NoData from "../../components/nodata";
import styles from "./index.less";
import BaseController from "../../components/controller";

@connect(store => ({ orderData: store.price }))
class OrderList extends BaseController {
  constructor(props) {
    super(props);
    this.state = {
      orderName: "",
      pageNum: 1,
      orderStatus: "",
    };

    this.listRef = React.createRef();
  }

  componentDidMount() {
    this.setTitle("询价列表");
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
    dispatch({ type: "price/clear" });
  }

  onTabChange = async () => {
    const query = {
      pageNum: 1,
    };

    await this.setState(state => ({ ...state, ...query }));
    this.getOrders();
  };

  getOrders = (clear = true) => {
    const { dispatch } = this.props;
    const { orderName, pageNum } = this.state;
    const query = {
      page: {
        displayNum: 8,
        curPageNum: pageNum + 1,
      },
      productName: orderName,
    };
    if (clear) {
      this.listRef.current.scrollTop = 0;
      query.page.curPageNum = 1;
    }

    dispatch({ type: "price/getOrders", payload: query, clear }).then(() => {
      this.setState({
        pageNum: query.page.curPageNum,
      });
    });
  };

  onChangeSearch = value => {
    this.setState({ orderName: value });
  };

  onGoDetail = id => {
    router.push(`/orderdetail?id=${id}`);
  };

  render() {
    const { orderName } = this.state;
    const { orderData } = this.props;
    const { orderList, totalNum } = orderData;
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
          content="询价记录将保留60天，未完成记录超过当日23:50未处理将自动关闭"
        />
        <SearchBar
          placeholder="请输入关键字"
          value={orderName}
          onChange={this.onChangeSearch}
          maxLength={12}
          onSubmit={this.getOrders.bind(this, true)}
        />
        <div className={styles.scroll} ref={this.listRef}>
          {orderList.length === 0 ? (
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
                    onGoDetail={this.onGoDetail}
                    type="price"
                  />
                );
              })}
            </ListScroll>
          )}
        </div>
      </div>
    );
  }
}

export default OrderList;
