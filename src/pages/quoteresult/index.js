import React from "react";
import DataResult from "./components/dataresult";
import UndataResult from "./components/undataresult";
import BaseController from "../../components/controller";

class QuoteResult extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const { premiumBatchNumber, und } = query;
    this.state = {
      premiumBatchNumber,
      und,
    };
  }

  componentDidMount() {
    this.setTitle("报价结果");
  }

  render = () => {
    const { premiumBatchNumber, und } = this.state;

    return (
      <>
        {und ? (
          <UndataResult inqBasicId={premiumBatchNumber} />
        ) : (
          <DataResult inqBasicId={premiumBatchNumber} />
        )}
      </>
    );
  };
}

export default QuoteResult;
