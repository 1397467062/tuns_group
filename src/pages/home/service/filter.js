import { isEmpty } from "tuns-utils";

const filterTabs = data => {
  const tabs = [{ title: "全部", id: "" }];
  data.map(item => {
    return tabs.push({ title: item.insTypeName, id: item.insTypeId });
  });
  return tabs;
};

const filterProdList = data => {
  if (data.length === 0) {
    return [];
  }
  return data.map(item => {
    return {
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      productAlias: item.productAlias,
      fileUrl:
        item.fileUrl ||
        "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
      feature: item.feature,
      premMin: Number(item.premMin).toFixed(2),
      promote: filterPromote(item.extensionInfo),
      marks: filterMarks(item.productLabel),
    };
  });
};

const filterPromote = data => {
  if (!data || data.length === 0 || isEmpty(data)) {
    return [];
  }
  const datas = JSON.parse(data);
  return datas.map((item, index) => {
    return { id: `${index}`, text: item.promoteDesc };
  });
};

const filterMarks = data => {
  if (!data || data.length === 0) {
    return [{ id: "0", type: "" }];
  }
  return JSON.parse(data).map(item => {
    if (item === "newest_sell") {
      return { id: item, type: "3" };
    } else if (item === "rcmd_sell") {
      return { id: item, type: "2" };
    } else {
      return { id: item, type: "1" };
    }
  });
};

export { filterTabs, filterProdList };
