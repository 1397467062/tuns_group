import React from "react";
import Form from "tuns-mobile/lib/form";
import { Button, Toast } from "antd-mobile";
import { connect } from "dva";
import Card from "../quote/components/card";
import styles from "./index.less";
import BaseController from "../../components/controller";

// import { data } from "./data"

@connect(store => ({ unquoteData: store.unquote, quoteData: store.quote }))
class UnquoteList extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const { code } = query;
    this.state = {
      code,
      formstate: null,
    };
  }

  componentDidMount() {
    this.setTitle("马上报价");
    const { dispatch } = this.props;
    const { code, formstate } = this.state;
    dispatch({
      type: "unquote/getconfig",
      payload: { insTypeId: code },
    });
    dispatch({
      type: "quote/saveUserInfo",
      payload: {},
      callback: res => {
        formstate.setFieldsValue({
          "nonContactsModel:contactsName": res.realName,
        });
        this.setState();
      },
    });
  }

  onCommit = form => {
    form.validateFields((error, value) => {
      if (error) {
        const key = Object.keys(error)[0];
        const { errors } = error[key];
        const { message } = errors[0];

        return Toast.fail(message);
      } else {
        this.updata(value);
      }
    });
  };

  updata = values => {
    const res = {};
    Object.keys(values).forEach(key => {
      const keys = key.split(":");
      if (!res[keys[0]]) {
        res[keys[0]] = {};
      }
      res[keys[0]][keys[1]] = values[key];
    });

    const inqCof = { data: [] };
    for (const key in res) {
      if (key) {
        if (key === "nonGuaranteeModel") {
          inqCof.nonStandard = res[key];
        } else {
          inqCof.data.push(res[key]);
        }
      }
    }

    const { dispatch } = this.props;
    const { code } = this.state;
    inqCof.data.push({ insTypeId: code });
    dispatch({
      type: "unquote/saveUnquote",
      payload: { inqCof },
    });
  };

  submitRender = form => {
    this.state.formstate = form;
    return (
      <div className={styles.footer}>
        <Button
          className={styles.commitbtn}
          onClick={() => this.onCommit(form)}
        >
          立即询价
        </Button>
      </div>
    );
  };

  render = () => {
    const { unquoteData } = this.props;
    const { configs } = unquoteData;
    return (
      <div className={styles.root}>
        <Form className={styles.body} submitRender={this.submitRender}>
          {configs.map(item => {
            const show = {};
            if (item.isDefaultShow === "N") {
              show.classname = styles.hiddenCard;
            }
            return (
              <Card
                key={item.id}
                detail={item.mdetailMiniDTOS}
                keyname={item.modelCode}
                titlename={item.modelName}
                relation={item.mreDetailMiniDTOS}
                {...show}
              />
            );
          })}
        </Form>
      </div>
    );
  };
}
export default UnquoteList;
