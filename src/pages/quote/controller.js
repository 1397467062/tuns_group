import React from "react";
import { storage } from "tuns-utils";
import Form from "tuns-mobile/lib/form";
import { Button, Toast } from "antd-mobile";
import { connect } from "dva";
import { TSRouter as router } from "../../tools/router";
import Card from "./components/card";
import styles from "./index.less";

import { savefordata } from "./service/filter";

@connect(store => ({ quoteData: store.quote, companyData: store.inscompanys }))
class QuoteContorller extends React.Component {
  constructor(props) {
    super(props);
    const { code } = props;
    this.state = {
      code,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { code } = this.state;
    dispatch({
      type: "quote/getconfig",
      payload: { insTypeId: code },
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
    const { dispatch, quoteData } = this.props;
    const { code } = this.state;
    const { premdata } = quoteData;
    const savedata = savefordata(values, premdata, code);
    savedata.giOfferInsCompanyDTOList = null;
    storage.set("quoteValue", JSON.stringify(values));
    let num = 0;
    for (const key in values) {
      if (key) {
        if (key.indexOf("insuredTypeModel:insuredNumber_") !== -1) {
          num += 1;
        }
      }
    }
    storage.set("insuredlNum", num);
    dispatch({
      type: "inscompanys/getCompany",
      payload: savedata.giGroupInqGuaranteeDTOList,
    }).then(res => {
      if (res) {
        const { giOfferInsCompanyDTOList = [] } = res;
        savedata.giOfferInsCompanyDTOList = giOfferInsCompanyDTOList || [];
        if (
          Array.isArray(giOfferInsCompanyDTOList) &&
          giOfferInsCompanyDTOList.length > 0
        ) {
          storage.set("askValue", JSON.stringify(savedata));
          router.push(`/inscompanylist?`);
        } else {
          dispatch({
            type: "quote/saveQuote",
            payload: savedata,
          }).then(result => {
            if (result) {
              router.push(
                `/quoteresult?premiumBatchNumber=${result.inqBasicId}&und=1`
              );
            }
          });
        }
      }
    });
  };

  submitRender = form => {
    const { formstate } = this.props;
    formstate(form);
    return (
      <div className={styles.footer}>
        <Button
          className={styles.commitbtn}
          onClick={() => this.onCommit(form)}
        >
          确定
        </Button>
      </div>
    );
  };

  render = () => {
    const { quoteData, insuredlNum } = this.props;
    const { configs } = quoteData;
    return (
      <div className={styles.root}>
        <Form className={styles.body} submitRender={this.submitRender}>
          {configs.map(item => {
            const show = {};
            if (item.isDefaultShow === "N") {
              show.isHide = true;
            }
            return (
              <Card
                key={item.id}
                detail={item.modelDetails}
                keyname={item.modelCode}
                titlename={item.modelName}
                relation={item.modelRelations}
                insuredlNum={insuredlNum}
                {...show}
              />
            );
          })}
        </Form>
      </div>
    );
  };
}
export default QuoteContorller;
