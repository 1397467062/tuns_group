import React from "react";
import { Toast } from "antd-mobile";
import { storage } from "tuns-utils";
import { connect } from "dva";
import Tree from "tuns-mobile/lib/tree";
import Button from "tuns-mobile/lib/button";
import { TSRouter as router } from "../../tools/router";
import { getinsList, getFlag } from "./data";
import styles from "./index.less";
import BaseController from "../../components/controller";

@connect(store => ({ instypesData: store.instypes }))
class TreeDemo extends BaseController {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
    };
  }

  componentDidMount() {
    this.setTitle("选择险种");
    storage.set("quoteValue", null);
    storage.set("insuredlNum", null);
    const { dispatch } = this.props;
    dispatch({
      type: "instypes/getProducts",
    });
  }

  onClick = () => {
    const { code } = this.state;
    const { instypesData } = this.props;
    const { insList } = instypesData;
    if (code && code.length) {
      const flags = getFlag(insList);
      let path = "";
      if (flags[code] === "0") {
        path = "/unquote";
      } else {
        path = "/quote";
      }
      router.push(`${path}?code=${code}`);
    } else {
      Toast.info("请选择险种");
    }
  };

  render() {
    const { instypesData } = this.props;
    const { insList } = instypesData;
    return (
      <div className={styles.root}>
        <div className={styles.body}>
          <div className={styles.head}>请选择险种</div>
          <Tree
            // defaultValue="reg1"
            onChange={code => {
              this.setState({ code });
            }}
            radio
            data={getinsList(insList)}
          />
        </div>
        <div className={styles.bottom}>
          <Button
            className={styles.btn}
            onClick={this.onClick}
            type="primary"
            isGradual
          >
            一键报价
          </Button>
        </div>
      </div>
    );
  }
}

export default TreeDemo;
