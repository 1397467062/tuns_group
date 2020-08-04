import React from "react";
import { connect } from "dva";
import { equals } from "tuns-utils";
import ListScroll from "tuns-mobile/lib/listscroll";
import UITab from "tuns-mobile/lib/tabs";
import Recommendcard from "tuns-mobile/lib/recommendcard";
import ListCard from "tuns-mobile/lib/card/list";
import { TSRouter as router } from "../../tools/router";
import NoData from "../../components/nodata";

import styles from "./index.less";
import BaseController from "../../components/controller";

@connect(store => ({ listData: store.home }))
class HomeList extends BaseController {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      insTypeId: "",
    };

    this.listRef = React.createRef();
  }

  componentDidMount() {
    this.setTitle("团险");
    const { dispatch } = this.props;
    dispatch({ type: "home/queryInsOne" });
    this.getOrders();

    dispatch({
      type: "appSpace/updateNavBarRightIcons",
      payload: [
        {
          text: "待完善订单",
          onClick: () => {
            this.pendingOrder();
          },
        },
      ],
    });
  }

  shouldComponentUpdate(nextProps) {
    const { listData } = this.props;
    return !equals(listData, nextProps.listData);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "home/clear" });

    dispatch({
      type: "appSpace/updateNavBarRightIcons",
      payload: [],
    });
  }

  onTabChange = async data => {
    const query = {
      pageNum: 1,
      insTypeId: data.id,
    };

    await this.setState(state => ({ ...state, ...query }));
    this.getOrders();
  };

  getOrders = (clear = true) => {
    const { dispatch } = this.props;
    const { pageNum, insTypeId } = this.state;
    const query = {
      page: {
        displayNum: 8,
        curPageNum: pageNum + 1,
      },
      insTypeId,
    };
    if (clear) {
      this.listRef.current.scrollTop = 0;
      query.page.curPageNum = 1;
    }

    dispatch({ type: "home/queryProdInfo", payload: query, clear }).then(() => {
      this.setState({
        pageNum: query.page.curPageNum,
      });
    });
  };

  handleClick = id => {
    router.push(`/detail?productCode=${id}`);
  };

  pendingOrder = () => {
    router.push(`/pending`);
  };

  render() {
    const { listData } = this.props;
    const { prodList, totalNum, tabs } = listData;

    const noData = (
      <NoData text="暂无数据" classNames={styles.nodata} key="no_data" />
    );
    return (
      <div className={styles.root}>
        <div className={styles.title}>
          <Recommendcard
            onClick={() => {
              router.push("/checkinsurestype");
            }}
          />
        </div>
        <UITab tabs={tabs} onChange={this.onTabChange} swipeable={false}>
          <>
            <div className={styles.scroll} ref={this.listRef}>
              <ListScroll
                onLoad={this.getOrders.bind(this, false)}
                hasMore={prodList.length < totalNum}
                initLoad
              >
                {prodList.length > 0
                  ? prodList.map((item, index) => {
                      return (
                        <div key={`${item.productId}_${index}`}>
                          <ListCard
                            img={item.fileUrl}
                            title={item.productName}
                            texts={[{ id: "texts1", text: item.feature }]}
                            money={item.premMin}
                            promote={item.promote}
                            marks={item.marks}
                            button
                            onClick={this.handleClick.bind(
                              this,
                              item.productId
                            )}
                          />
                          <p className={styles.line} />
                        </div>
                      );
                    })
                  : [noData]}
              </ListScroll>
            </div>
          </>
        </UITab>
      </div>
    );
  }
}

export default HomeList;
