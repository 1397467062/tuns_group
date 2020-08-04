export default {
  "POST /api/ins/app/groupInsures/groupInsureResults": {
    data: {
      totalNum: 3,
      resultData: [
        {
          id: "1",
          insBasicId: "123",
          productName: "光大财险团体意外险",
          productUrl:
            "https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png",
          creTm: "2019-12-31 20:39:44",
          startDate: "2020-01-01",
          endDate: "2020-12-31",
          premAmount: 1140,
        },
        {
          id: "2",
          insBasicId: "456",
          productName: "中华联合团体意外险",
          productUrl:
            "https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png",
          creTm: "2019-10-31 20:39:44",
          startDate: "2019-10-01",
          endDate: "2019-12-31",
          premAmount: 1433,
        },
        {
          id: "3",
          insBasicId: "789",
          productName: "腾顺团体高级险",
          productUrl:
            "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          creTm: "2019-10-31 20:39:44",
          startDate: "2019-10-01",
          endDate: "2019-12-31",
          premAmount: 1240,
        },
      ],
    },
  },
};
