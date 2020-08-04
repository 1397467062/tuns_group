import React from "react";
import { storage } from "tuns-utils";
import { connect } from "dva";
import QuoteController from "./controller";
import BaseController from "../../components/controller";

@connect(store => ({ quoteData: store.quote }))
class QuoteList extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const { code } = query;
    this.state = {
      code,
      formstate: null,
      insuredlnum: null,
    };
  }

  componentWillMount() {
    const insuredlnum = storage.get("insuredlNum");
    this.setState({ insuredlnum });
  }

  componentDidMount() {
    this.setTitle("一键报价");
    const v = JSON.parse(storage.get("quoteValue"));
    const { formstate } = this.state;
    if (v) {
      formstate.setFieldsValue(v);
      storage.set("insuredlNum", null);
      storage.set("quoteValue", null);
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: "quote/saveUserInfo",
        payload: {},
        callback: res => {
          setTimeout(() => {
            formstate.setFieldsValue({
              "contactsModel:contactsName": res.realName,
            });
          }, 800);
        },
      });
    }
  }

  render = () => {
    const { formstate, code, insuredlnum } = this.state;
    return (
      <QuoteController
        code={code}
        insuredlNum={insuredlnum}
        formstate={form => {
          if (!formstate) this.state.formstate = form;
        }}
      />
    );
  };
}

export default QuoteList;
