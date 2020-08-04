export default {
  "POST /api/ins/app/groupInsures/groupInsureResults": {
    head: {
      version: "0.0.1",
      requestId: "123123123",
      system: "1",
      deviceId: "unknown",
      tokenId: "123",
    },
    body: {
      totalNum: 4,
      resultData: [
        {
          id: "1",
          creTm: "2019-11-02 01:13:59",
          orderStatus: "0",
          productUrl:
            "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
          productName: "光大财险团体意外险",
          insureTime: "2019-07-30至2019-12-21",
          insuredNumber: 15,
          premAmount: 2010,
          inqBasicId: "1",
          extensionAmount: 80,
          orderNumber: "123123",
        },
        {
          id: "2",
          creTm: "2019-05-24 15:33:16",
          orderStatus: "1",
          productUrl:
            "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
          productName: "腾顺的团体意外险",
          insureTime: "2019-06-28至2020-06-27",
          insuredNumber: 35,
          premAmount: 1793,
          inqBasicId: "2",
          extensionAmount: 100,
          orderNumber: "123123",
        },
        {
          id: "3",
          creTm: "2019-10-23 10:19:16",
          orderStatus: "2",
          productUrl:
            "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
          productName: "交通银行团体意外险",
          insureTime: "2019-10-01至2020-05-03",
          insuredNumber: 120,
          premAmount: 2020,
          inqBasicId: "3",
          extensionAmount: 300,
          orderNumber: "123123",
        },
        {
          id: "4",
          creTm: "2020-05-24 15:00:16",
          orderStatus: "3",
          productUrl:
            "http://test.file.tuns.com.cn/tuns/assets/images/product_list_default.png",
          productName: "平安住院团体意外险",
          insureTime: "2019-09-13至2020-09-13",
          insuredNumber: 200,
          premAmount: 1980,
          inqBasicId: "4",
          extensionAmount: 50,
          orderNumber: "123123",
        },
      ],
    },
  },
};
