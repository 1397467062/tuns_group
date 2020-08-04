import { isEmpty } from "tuns-utils";
import moment from "moment";

const trimOrdersData = data => {
  if (data.length === 0) {
    return [];
  }
  return data.map(item => {
    return {
      id: item.insBasicId,
      time: item.creTm,
      status: item.orderStatus,
      img:
        filterImg(item.leftProdImg) ||
        "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
      title: item.productName,
      date: `${moment(item.startDate).format("YYYY-MM-DD")}至${moment(
        item.endDate
      ).format("YYYY-MM-DD")}`,
      people: item.insuredNumber,
      money: item.premAmount,
      inqBasicId: item.insBasicId,
      inquiryNo: item.orderNumber,
      orderUuid: item.tsOrderNo,
      promote: item.extensionAmount,
      productId: item.productId,
      orderNumber: item.tsOrderNo,
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
