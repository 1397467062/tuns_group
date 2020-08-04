import { isEmpty } from "tuns-utils";

const trimOrdersData = data => {
  if (data.length === 0) {
    return [];
  }
  return data.map(item => {
    return {
      id: item.id,
      time: item.creTm,
      status: item.quotationStatus,
      img:
        filterImg(item.leftProdImg) ||
        "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
      title: item.productName,
      date: item.guaranteePeriod || "",
      people: item.sumInsureNumber || "",
      money: item.premAmount,
      inqBasicId: item.inqBasicId,
      inquiryNo: item.inquiryNo,
      promote: item.extensionAmount,
    };
  });
};

const filterImg = img => {
  if (isEmpty(img) || typeof img !== "object" || img.length === 0) {
    return "";
  }
  return JSON.parse(img[0])[0].fileUrl;
};

export { trimOrdersData };
