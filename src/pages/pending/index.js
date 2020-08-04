import React from "react";
import { equals } from "tuns-utils";
import { connect } from "dva";
import { Icon } from "antd-mobile";
import ListScroll from "tuns-mobile/lib/listscroll";
import NoticeBar from "tuns-mobile/lib/noticebar";
import OrderItem from "./component/orderitem/index";
import styles from "./index.less";
import NoData from "../../components/nodata";
import BaseController from "../../components/controller";

@connect(store => ({ listData: store.pending }))
class PendingOrder extends BaseController {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
    };
    this.listRef = React.createRef();
  }

  componentDidMount() {
    this.setTitle("投保信息待完善");
    this.getOrders();
  }

  shouldComponentUpdate(nextProps) {
    const { listData } = this.props;
    return !equals(listData, nextProps.listData);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "pending/clear" });
  }

  getOrders = (clear = true) => {
    const { dispatch } = this.props;
    const { pageNum } = this.state;
    const query = {
      delFlag: "0",
      page: {
        displayNum: 8,
        curPageNum: pageNum + 1,
      },
    };
    if (clear) {
      this.listRef.current.scrollTop = 0;
      query.page.curPageNum = 1;
    }

    dispatch({ type: "pending/queryProdInfo", payload: query, clear }).then(
      () => {
        this.setState({
          pageNum: query.page.curPageNum,
        });
      }
    );
  };

  render() {
    const { listData, dispatch } = this.props;
    const { prodList, totalNum } = listData;
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
          content="为了能在您选择的日期生效，请在下单当天23:50前完成投保"
        />
        <div className={styles.scroll} ref={this.listRef}>
          {prodList.length !== 0 ? (
            <ListScroll
              onLoad={this.getOrders.bind(this, false)}
              hasMore={prodList.length < totalNum}
              initLoad
            >
              {prodList.map((item, index) => {
                return (
                  <OrderItem
                    key={`${item.id}_${index}`}
                    item={item}
                    dispatch={dispatch}
                    onDelet={this.getOrders.bind(this, true)}
                  />
                );
              })}
            </ListScroll>
          ) : (
            <NoData text="暂无数据" className={styles.nodata} />
          )}
        </div>
      </div>
    );
  }
}

export default PendingOrder;
