export default {
  "POST /api/name/list": (req, res) => {
    setTimeout(() => {
      res.json({
        data: [
          {
            name: "二毛",
            id: "2",
          },
          {
            name: "三毛",
            id: "3",
          },
          {
            name: "四毛",
            id: "4",
          },
        ],
      });
    }, 6000);
  },
};
