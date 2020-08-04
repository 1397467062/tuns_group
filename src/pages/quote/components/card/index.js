import React from "react";
import { Button, Icon, Toast } from "antd-mobile";
import { getRule } from "utils/rules";
import { clone } from "tuns-utils";
import Form from "tuns-mobile/lib/form";
import FormDatePicker from "tuns-mobile/lib/form/datepicker";
import moment from "moment";
import {
  pickerItem,
  disableItem,
  baseItem,
  stepItem,
  dateItem,
  insPickerItem,
  areaPickItem,
} from "./item";
// import { rulesMsg } from "./rule";

import styles from "./index.less";

const { Group } = Form;

class Card extends React.Component {
  constructor(props) {
    super(props);
    const { detail = [], keyname, insuredlNum } = props;
    let dateState = {};
    detail.forEach(item => {
      if (item.pageElType === "07") {
        dateState = {
          startDate: this.transfDate(item.minTimestamp),
        };
      }
    });
    let insuredState = {}
    if (keyname === "insuredTypeModel") {
      let insurederId = 1;
      const array = [];

      if (insuredlNum && insuredlNum > 1) {
        for (let i = 0; i < insuredlNum; i += 1) {
          const modelData = clone(detail);
          insurederId = 1 + i;
          modelData.pageElKey = insurederId;
          array.push(modelData);
        }

      } else {
        const modelData = clone(detail);
        modelData.pageElKey = insurederId;
        array.push(modelData);
      }


      insuredState = {
        copies: [1],
        modelDetailData: clone(detail),
        array,
        keyname,
        insurederId,
      }
    }
    this.state = {
      ...insuredState,
      ...dateState,
    };
  }


  creactParamsItem = (item, index) => {
    const { isDefaultShow, isRelation, pageElCode } = item;
    const { keyname } = this.props
    const { array } = this.state;
    let hidden = false;

    const isrelation = isRelation;
    const inputProps = {};
    if (keyname === "insuredTypeModel" && pageElCode === "occupationCode") {
      const { form } = this.props;
      const keystr = `${keyname}:occupationCode_`;
      const disvalues = []
      array.forEach(aitem => {
        if (aitem.pageElKey !== index) {
          const occvalue = form.getFieldValue(keystr + aitem.pageElKey);
          if (occvalue) {
            disvalues.push(occvalue)
          }
        }
      })
      inputProps.disvalues = disvalues
    }

    if (isDefaultShow === "0" && !isrelation) {
      // return <></>;
      hidden = true;
    }

    let isNeed = false;
    if (item.isNeed === "1") {
      isNeed = true;
    }
    const key =
      typeof index === "number"
        ? `${keyname}:${pageElCode + item.id + index}`
        : `${keyname}:${pageElCode + item.id}`;

    const name =
      typeof index === "number"
        ? `${keyname}:${pageElCode}_${index}`
        : `${keyname}:${pageElCode}`;
    const phonerule = ["contactsPhone"];
    const idrule = ["idCard"];
    // 规则判断
    let selfRule = [];
    if (phonerule.indexOf(pageElCode) !== -1) {
      selfRule = getRule(`public:phone`).rules;
    } else if (idrule.indexOf(pageElCode) !== -1) {
      selfRule = getRule(`public:idcard`).rules;
    }
    const rules = [
      ...selfRule,
      {
        required: isNeed,
        message: item.needTips || `请输入${item.pageElName}`,
      },
      // {
      //   validator: (a, value) => {
      //     const { form, setcopies, many } = this.props;
      //     const { copies } = this.state;
      //     const { field } = a

      //     // 业务逻辑判断
      //     // if (item.pageEl === "profession") {
      //     //   console.log(item.prodCondRuleDTOs);
      //     // }
      //     const errorInfo = rulesMsg(item.prodCondRuleDTOs, form, array, many);
      //     a.message = errorInfo.rulesMsg;
      //     return !errorInfo.error;
      //   },
      // },
    ];
    // 文字长度判断
    inputProps.maxLength = 50;
    //---------------------------

    const params = {
      isHide: hidden,
      rules,
      key,
      name,
      title: item.pageElName,
      ...inputProps,
    };
    return params;
  };

  /**
   * 01 选项 pick
   * 02 固定文本 disable
   * 03 输入框 base
   * 04 区间
   * 05 城市
   * 06 终保时间
   * 07 起保时间
   * 08 修改保障计划
   * 09 职业类别
   * 10 数字加减框
   * 11 时间区间
   *
   * @param {string} pageElType
   */

  creatItem = (item, index) => {
    const params = this.creactParamsItem(item, index);
    switch (item.pageElType) {
      case "01":
        return pickerItem(item, params);
      case "02":
        return disableItem(item, params);
      case "03":
        return baseItem(item, params);
      case "05":
        return areaPickItem(item, params);
      case "06":
        return this.endDateItem(item, params);
      case "07":
        return this.startDateItem(item, params);
      case "10":
        return stepItem(item, params);
      case "11":
        return dateItem(item, params);
      case "13":
        return insPickerItem(item, params);
      default:
        return baseItem(item, params);
    }
  };

  transfDate = (dateString, tem = "YYYY-MM-DD HH:mm:ss") => {
    return moment(dateString, tem).toDate();
  };

  /**
   * 07 起保时间
   */

  startDateItem = (item, params) => {
    return (
      <FormDatePicker
        mode="date"
        minDate={this.transfDate(item.minTimestamp)}
        maxDate={this.transfDate(item.maxTimestamp)}
        defaultValue={this.transfDate(item.minTimestamp)}
        onOk={res => {
          this.setState({ startDate: res });
        }}
        {...params}
      />
    );
  };
  /**
   * 06 终保时间
   */

  endDateItem = (item, params) => {
    const { startDate } = this.state;
    const { form } = this.props;
    const date = form.getFieldValue("insBegin") || new Date(startDate);
    let endDate = date;
    const { dateIntervalUnit, dateInterval = 0 } = item;
    switch (dateIntervalUnit) {
      case "Y":
        endDate = date.setFullYear(date.getFullYear() + dateInterval);
        break;
      case "M":
        endDate = date.setMonth(date.getMonth() + dateInterval);
        break;
      case "D":
        endDate = date.setDate(date.getDate() + dateInterval);
        break;
      default:
        endDate = date.setDate(date.getDate() + dateInterval);
        break;
    }
    endDate = date.setDate(date.getDate() - 1);
    const crtTimeFtt = now => {
      const month =
        now.getMonth() + 1 >= 10
          ? now.getMonth() + 1
          : `0${now.getMonth() + 1}`;
      const day = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`;

      return `${now.getFullYear()}-${month}-${day}`;
    };

    item.defaultValue = crtTimeFtt(new Date(endDate));

    return disableItem(item, params);
  };

  render = () => {
    const { props } = this;
    const { detail, titlename, keyname, relation, form, isHide, key } = props;
    const { array } = this.state;

    if (relation) {
      if (keyname === "insuredTypeModel") {
        // 遍历关联数据
        // 遍历表单数据
        array.forEach(dic => {
          const trueArr = [];
          relation.forEach(dto => {
            const value = form.getFieldValue(
              `${keyname}:${dto.elCode}_${dic.pageElKey}`
            );
            if (value && dto.elValue === value) {
              dto.mrelationDMiniDTOList.forEach(result => {
                if (result.isRelation === "1") {
                  trueArr.push(result);
                }
              });
            }
            dic.forEach(model => {
              model.isRelation = false;
              trueArr.forEach(result => {
                if (model.id === result.elId) {
                  model.isRelation = true;
                }
              });
            });
          });
        });
      } else {
        const trueArr = [];
        relation.forEach(dto => {
          const value = form.getFieldValue(`${keyname}:${dto.elCode}`);
          if (value && dto.elValue === value && Array.isArray(dto.mrelationDMiniDTOList)) {
            dto.mrelationDMiniDTOList.forEach(result => {
              if (result.isRelation === "1") {
                trueArr.push(result);
              }
            });
          }
        });
        detail.forEach(model => {
          model.isRelation = false;
          trueArr.forEach(result => {
            if (model.id === result.elId) {
              model.isRelation = true;
            }
          });
        });
      }
    }

    if (keyname === "insuredTypeModel") {
      return isHide ? null : (
        <div className={styles.card} key={key}>
          {array.map((dtos, index) => {
            return (
              <this.Insed {...props} index={index}>
                {dtos.map(item => this.creatItem(item, dtos.pageElKey))}
              </this.Insed>
            );
          })}
          <Button className={styles.addbtn} onClick={this.addDto}>
            <Icon
              className={styles.addIcon}
              type="iconxz"
              color="rgba(251, 112, 55, 1)"
            />
            新增职业
          </Button>
        </div>
      );
    } else {
      return (
        <Group
          {...props}
          title={titlename}
          classname={styles.card}
        >
          {detail.map(item => this.creatItem(item))}
        </Group>
      );
    }
  };

  Insed = props => {
    const { children, classname, index, ...childrenProps } = props;
    return (
      <div>
        <div className={styles.insedHead}>
          <div>{`被保人类型${index + 1}`}</div>
          <div
            className={styles.Xicon}
            onClick={() => this.deteleDto(index)}
          >
            删除
          </div>
        </div>
        {React.Children.map(children, child =>
          React.cloneElement(child, { ...childrenProps })
        )}
      </div>
    );
  };

  addDto = () => {
    const { array, modelDetailData, insurederId, copies } = this.state;
    const { form } = this.props
    const { pageElKey } = array[array.length - 1]
    if (!form.getFieldValue(`insuredTypeModel:occupationCode_${pageElKey}`)) {
      return Toast.info("请选择职业类型");
    }
    if (array.length >= 5) {
      return Toast.info("被保人类型最多添加5个");
    }
    const modelData = clone(modelDetailData);
    const currentInsuredId = insurederId + 1;
    modelData.pageElKey = currentInsuredId;
    // const { setcopies } = this.props;
    const newCopies = [...copies];
    newCopies.push(1);
    // setcopies(newCopies);
    this.setState({
      array: array.concat([modelData]),
      copies: newCopies,
      insurederId: currentInsuredId,
    });

  };

  deteleDto = index => {
    // const { setcopies } = this.props;
    const { form } = this.props
    const { array, copies, modelDetailData } = this.state;
    const newArray = [...array];
    const newCopies = [...copies];
    if (newArray.length > 1) {
      newArray.splice(index, 1);
      newCopies.splice(index, 1);
      const formvalue = form.getFieldsValue()
      newArray.forEach((item, i) => {
        item.pageElKey = i + 1
      })
      const d = {}
      for (let a = index + 1; a < array.length; a += 1) {
        modelDetailData.forEach(item => {
          d[`insuredTypeModel:${item.pageElCode}_${a}`] = formvalue[`insuredTypeModel:${item.pageElCode}_${a + 1}`]
        })
      }
      form.setFieldsValue(d)
      // setcopies(newCopies);
      this.setState({
        array: newArray,
        copies: newCopies,
      });
    }
  };
}

export default Card;
