export const insdata = [
  {
    "insTypeId": "201912251704491120110040",
    "insTypeCode": null,
    "insTypeName": "财产险",
    "insTypeAlias": "财产险",
    "insTypeLevel": "1",
    "parentId": "0",
    "standardFlag": null,
    "nextList": null,
  },
  {
    "insTypeId": "201912251704573950110043",
    "insTypeCode": null,
    "insTypeName": "意外险",
    "insTypeAlias": "意外险",
    "insTypeLevel": "1",
    "parentId": "0",
    "standardFlag": null,
    "nextList": [
      {
        "insTypeId": "201912251857049610110006",
        "insTypeCode": null,
        "insTypeName": "分类名称哈嘿",
        "insTypeAlias": "分类别名",
        "insTypeLevel": "2",
        "parentId": "201912251704573950110043",
        "standardFlag": null,
        "nextList": null,
      },
    ],
  },
  {
    "insTypeId": "201912251703575230110031",
    "insTypeCode": null,
    "insTypeName": "责任险",
    "insTypeAlias": "责任险",
    "insTypeLevel": "1",
    "parentId": "0",
    "standardFlag": null,
    "nextList": [
      {
        "insTypeId": "201912261856150620110007",
        "insTypeCode": null,
        "insTypeName": "船坞险二级",
        "insTypeAlias": "船坞险二级",
        "insTypeLevel": "2",
        "parentId": "201912251703575230110031",
        "standardFlag": null,
        "nextList": null,
      },
      {
        "insTypeId": "201912251704279040110034",
        "insTypeCode": null,
        "insTypeName": "雇主责任险",
        "insTypeAlias": "雇主责任险",
        "insTypeLevel": "3",
        "parentId": "201912251703575230110031",
        "standardFlag": null,
        "nextList": [
          {
            "insTypeId": "201912251856525100110004",
            "insTypeCode": null,
            "insTypeName": "分类名称哈",
            "insTypeAlias": "分类别名",
            "insTypeLevel": "4",
            "parentId": "201912251704279040110034",
            "standardFlag": null,
            "nextList": null,
          },
        ],
      },
      {
        "insTypeId": "201912251704400530110037",
        "insTypeCode": null,
        "insTypeName": "公众责任险",
        "insTypeAlias": "公众责任险",
        "insTypeLevel": "3",
        "parentId": "201912251703575230110031",
        "standardFlag": true,
        "nextList": null,
      },
    ],
  },
  {
    "insTypeId": "201912261855489890110004",
    "insTypeCode": null,
    "insTypeName": " 船坞险",
    "insTypeAlias": "船坞险",
    "insTypeLevel": "1",
    "parentId": "0",
    "standardFlag": null,
    "nextList": null,
  },
]

const getinsdata = data => {
  let insdatas = {}
  data.forEach(item => {

    insdatas[item.insTypeId] = item.standardFlag;

    if (Array.isArray(item.nextList) && item.nextList.length > 0) {
      insdatas = { ...insdatas, ...getinsdata(item.nextList) };
    }

  })
  return insdatas

}



const parseProfession = data =>
  data.map(item => {
    const res = {
      id: item.insTypeId,
      title: item.insTypeName,
      value: item.insTypeId,
    };
    if (Array.isArray(item.nextList) && item.nextList.length > 0) {
      res.children = parseProfession(item.nextList);
    }
    return res;
  });


export const getinsList = data => {
  return parseProfession(data)
}
export const getFlag = data => {
  return getinsdata(data)
}
