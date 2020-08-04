export const mergedata = (res, safeRes) => {
  const { data = [] } = res;

  const safedata = safeRes.data;
  const { giGroupSafeguardsDTOS = [] } = safedata;
  const premdata = {};
  data.some(a => {
    if (a.modelCode === "guaranteeModel") {
      const { modelDetails = [] } = a;
      giGroupSafeguardsDTOS.forEach(option => {
        modelDetails.some(item => {
          if (item.pageElId === option.riskLiabTypeId) {
            if (!premdata[item.pageElCode]) premdata[item.pageElCode] = [];
            const { premAmountList = [] } = option;
            premAmountList.map(prem => {
              prem.riskLiabTypeId = option.riskLiabTypeId;
              prem.name = prem.premDesc;
              prem.value = prem.premAmount + prem.premUnit;
              prem.pageElName = item.pageElName;
              prem.support = true;
              premdata[item.pageElCode].push(prem);
              return prem;
            });
            item.elOptions = JSON.stringify(premAmountList);
            return true;
          }
          return false;
        });
      });

      return true;
    }
    return false;
  });
  return { data, premdata };
};

export const savefordata = (values, premdata, code) => {
  const res = {};
  Object.keys(values).forEach(key => {
    const keys = key.split(":");
    if (!res[keys[0]]) {
      res[keys[0]] = {};
    }
    res[keys[0]][keys[1]] = values[key];
  });
  const configInfoJson = [];
  let inquiryPersons = 0;
  let giGroupInqOccupationDTOList = [];
  const giGroupInqGuaranteeDTOList = [];
  for (const key in res) {
    if (key === "insuredTypeModel") {
      const varr = res[key];
      const vres = {};
      Object.keys(varr).forEach(vkey => {
        const vkeys = vkey.split("_");
        if (!vres[vkeys[1]]) {
          vres[vkeys[1]] = {};
        }
        vres[vkeys[1]][vkeys[0]] = varr[vkey];
      });
      for (const vvkey in vres) {
        if (vvkey) {
          const a = vres[vvkey];
          const b = {};
          const { occupationCode } = a;

          b.occupationCode = Array.isArray(occupationCode)
            ? occupationCode.join(",")
            : occupationCode;
          b.insureNumber = a.insuredNumber;
          giGroupInqOccupationDTOList.push(b);

          const { insuredNumber = 0 } = vres[vvkey];

          inquiryPersons += Number(insuredNumber);
        }
      }
    } else if (key === "guaranteeModel") {
      for (const premkey in premdata) {
        if (premkey) {
          const element = premdata[premkey];
          if (res[key][premkey]) {
            element.some(op => {
              if (res[key][premkey] === op.value) {
                giGroupInqGuaranteeDTOList.push({
                  riskLiabTypeId: op.riskLiabTypeId,
                  riskLiabTypeName: op.pageElName,
                  amount: op.premAmount,
                  unit: op.premUnit,
                  premAmount: op.premAmount,
                  premUnit: op.premUnit,
                  premDesc: op.premDesc,
                });
                return true;
              }
              return false;
            });
          } else {
            const op = element[0];
            giGroupInqGuaranteeDTOList.push({
              riskLiabTypeId: op.riskLiabTypeId,
              riskLiabTypeName: op.pageElName,
              amount: 0,
              premAmount: 0,
              premDesc: 0,
            });
          }
        }
      }
    } else {
      // value 数组 转 string
      for (const a in res[key]) {
        if (a) {
          const vvv = res[key][a];
          if (Array.isArray(vvv)) {
            res[key][a] = vvv.join(",");
          }
        }
      }
      configInfoJson.push(res[key]);
    }
  }
  configInfoJson.push({ insTypeId: code, inquiryPersons });

  giGroupInqOccupationDTOList = giGroupInqOccupationDTOList.filter(
    item => item.insureNumber
  );
  return {
    giGroupInqOccupationDTOList,
    configInfoJson,
    giGroupInqGuaranteeDTOList,
  };
};
