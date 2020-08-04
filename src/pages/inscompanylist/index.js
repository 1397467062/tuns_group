import React from "react";
import { connect } from "dva";
import { storage } from "tuns-utils";
import { List, Switch, Button, Toast } from "antd-mobile";
import { TSRouter as router } from "../../tools/router";
import styles from "./index.less";
import BaseController from "../../components/controller";

@connect(store => ({ quoteData: store.quote, companyData: store.inscompanys }))
class InsCompanyList extends BaseController {
  constructor(props) {
    super(props);
    this.state = {
      cheackDatas: [],
    };
  }

  componentDidMount() {
    this.setTitle("选择保险公司");
    const { companyData } = this.props;
    const { inscompanys } = companyData;
    const cheackDatas = [];
    inscompanys.forEach(() => {
      cheackDatas.push("");
    });
    this.setState({ cheackDatas });
  }

  onCommit = () => {
    const { cheackDatas } = this.state;
    const { dispatch } = this.props;
    const data = JSON.parse(storage.get("askValue"));
    const array = [];
    cheackDatas.forEach(item => {
      if (item !== "") {
        array.push(item);
      }
    });
    if (array.length === 0) {
      Toast.info("请选择保险公司进行报价");
    } else if (array.length > 3) {
      Toast.info("最多选择3家保险公司进行报价");
    } else if (data) {
      data.giOfferInsCompanyDTOList = array;
      dispatch({
        type: "quote/saveQuote",
        payload: data,
      }).then(result => {
        if (result) {
          router.push(`/quoteresult?premiumBatchNumber=${result.inqBasicId}`);
        }
      });
    }
  };

  readerHeader = () => {
    return <div className={styles.header}>请选择保险公司进行报价</div>;
  };

  onChecked = () => {
    const { cheackDatas } = this.state;
    const cheackeds = [];
    cheackDatas.forEach(item => {
      if (item === "") {
        cheackeds.push(false);
      } else {
        cheackeds.push(true);
      }
    });
    return cheackeds;
  };

  render() {
    const { cheackDatas } = this.state;
    const { companyData } = this.props;
    const { inscompanys } = companyData;
    const cheackeds = this.onChecked();
    return (
      <div className={styles.root}>
        <List
          className={styles.content}
          renderHeader={() => "请选择保险公司进行报价"}
        >
          {inscompanys.map((item, index) => {
            return (
              <List.Item
                extra={
                  <Switch
                    checked={cheackeds[index]}
                    onChange={() => {
                      if (cheackDatas[index] === "") {
                        cheackDatas[index] = item;
                      } else {
                        cheackDatas[index] = "";
                      }
                      this.setState({
                        cheackDatas,
                      });
                    }}
                    color="#FB7037"
                  />
                }
              >
                <div className={styles.leftcontent}>
                  <img src={item.companyLogo} className={styles.icon} alt="" />
                  <div className={styles.celltitle}>{item.companyName}</div>
                </div>
              </List.Item>
            );
          })}
        </List>
        <div className={styles.footer}>
          <Button className={styles.commitbtn} onClick={() => this.onCommit()}>
            立即询价
          </Button>
        </div>
      </div>
    );
  }
}
export default InsCompanyList;
