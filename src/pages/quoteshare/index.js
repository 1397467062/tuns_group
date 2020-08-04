import React from "react";
import { post } from "tuns-fetch-web";
import { Toast } from "antd-mobile";
import InsList from "../quoteresult/components/list";
import Table from "../quoteresult/components/table";
import BaseController from "../../components/controller";

class DataResult extends BaseController {
  constructor(props) {
    super(props);
    const { query } = props.location;
    const { premiumBatchNumber, premiumNumber } = query;
    this.state = {
      premiumBatchNumber,
      premiumNumber,
      columns: [],
      datas: [],
      totalnum: 0,
      costTotal: [],
      premAmounts: {},
    };
  }

  componentDidMount() {
    this.setTitle("报价结果");
    const { premiumBatchNumber, premiumNumber } = this.state;
    post("/ins/app/groupShare/queryInqShare", {
      inqBasicId: premiumBatchNumber,
      querySetId: JSON.parse(premiumNumber),
    }).then(res => {
      const { response = {}, data = {} } = res;
      const { messageCd, messageInf = "" } = response.head;
      if (messageCd === "0000") {
        const { columns, occupation } = this.dataToModel(data);
        const datas = this.datas(occupation);
        this.setState({
          datas: datas.data,
          totalnum: datas.totalnum,
          premAmounts: datas.premAmounts,
          columns,
        });
      } else {
        Toast.info(messageInf);
      }
    });
    post("/ins/app/oneOffer/insCostTotal", {
      inqBasicId: premiumBatchNumber,
    }).then(res => {
      const { response = {}, data = {} } = res;
      const { messageCd, messageInf = "" } = response.head;
      if (messageCd === "0000") {
        const { giGroupInsCostTotalDTOList } = data;
        this.setState({ costTotal: giGroupInsCostTotalDTOList });
      } else {
        Toast.info(messageInf);
      }
    });
  }

  dataToModel = data => {
    const { giGroupInqCompanyResultDTOList } = data;
    const columns = [];
    const occupation = {};
    giGroupInqCompanyResultDTOList.forEach(item => {
      const dic = {};
      dic.key = item.inqPlanId;
      dic.title = item.companyName;
      dic.width = 100;
      dic.dataIndex = item.inqPlanId;
      dic.planId = item.inqPlanId;
      columns.push(dic);

      const { giGroupInqOccupationResultDTOS = [] } = item;
      giGroupInqOccupationResultDTOS.forEach(inf => {
        if (!occupation[inf.occupationCode]) {
          occupation[inf.occupationCode] = {};
        }

        occupation[inf.occupationCode].name = inf.occupationName;
        if (!occupation[inf.occupationCode].num) {
          occupation[inf.occupationCode].num = 0;
        }
        const num = parseFloat(inf.insureNumber);
        occupation[inf.occupationCode].num = num;
        if (!occupation[inf.occupationCode].risk) {
          occupation[inf.occupationCode].risk = {};
        }
        if (!occupation[inf.occupationCode].theme) {
          occupation[inf.occupationCode].theme = {};
        }
        inf.giGroupInqGuaranteeResultDTOList.forEach(risk => {
          if (!occupation[inf.occupationCode].risk[risk.riskLiabTypeId]) {
            occupation[inf.occupationCode].risk[risk.riskLiabTypeId] = {};
          }
          occupation[inf.occupationCode].risk[
            risk.riskLiabTypeId
          ].insurance_liability = risk.riskLiabTypeName;
          occupation[inf.occupationCode].risk[risk.riskLiabTypeId][
            item.inqPlanId
          ] = risk.premDesc;
          // 保费
          if (!occupation[inf.occupationCode].theme[item.inqPlanId]) {
            occupation[inf.occupationCode].theme[item.inqPlanId] = 0;
          }
          occupation[inf.occupationCode].theme[item.inqPlanId] +=
            risk.premAmount * num;
          // 推广费率
          if (!occupation[inf.occupationCode].extensionRate) {
            occupation[inf.occupationCode].extensionRate = {};
          }
          occupation[inf.occupationCode].extensionRate[item.inqPlanId] =
            item.extensionRate || "-";
          // 推广费
          if (!occupation[inf.occupationCode].extensionAmount) {
            occupation[inf.occupationCode].extensionAmount = {};
          }
          occupation[inf.occupationCode].extensionAmount[item.inqPlanId] =
            item.extensionAmount || "-";
        });
      });
    });
    return { columns, occupation };
  };

  datas = occupation => {
    const data = [];
    const opendata = [];
    const premAmounts = {};
    let totalnum = 0;
    for (const okey in occupation) {
      if (okey) {
        const item = occupation[okey];
        const arr = [];
        const rrr = item.risk;
        for (const key in rrr) {
          if (key) {
            arr.push(rrr[key]);
          }
        }
        for (const key in item.theme) {
          if (key) {
            const value = item.theme[key];
            item.theme[key] = parseFloat(value).toFixed(2);
            if (!premAmounts[key]) {
              premAmounts[key] = 0;
            }
            premAmounts[key] += value;
          }
        }
        totalnum += item.num;
        data.push({
          leftTopText: item.name,
          rightTopText: `人数:${item.num}`,
          columnDeleteIcon: true,
          data: arr,
          themeData: [
            {
              insurance_liability: "保费",
              ...item.theme,
            },
          ],
        });
        opendata.push({
          leftTopText: item.name,
          rightTopText: `人数:${item.num}`,
          data: arr,
          columnDeleteIcon: true,
          themeData: [
            {
              insurance_liability: "保费",
              ...item.theme,
            },
            {
              insurance_liability: "推广率",
              ...item.extensionRate,
            },
            {
              insurance_liability: "推广费",
              ...item.extensionAmount,
            },
          ],
        });
      }
    }
    return { data, totalnum, premAmounts, opendata };
  };

  render() {
    const { datas, columns, costTotal, totalnum, premAmounts } = this.state;
    return (
      <>
        {datas && datas.length ? (
          <Table columns={columns} datas={datas} />
        ) : null}
        <InsList
          costTotal={costTotal}
          totalnum={totalnum}
          premAmounts={premAmounts}
        />
      </>
    );
  }
}
export default DataResult;
