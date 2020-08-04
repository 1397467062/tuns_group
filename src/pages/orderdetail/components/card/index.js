import React from "react";
import { Card, Modal, List } from "antd-mobile";
import cn from "classnames";
import p from "tuns-class-prefix";
import { TSRouter as router } from "../../../../tools/router";
import "./index.less";

const CLS_PREFIX = "tuns-card-detail";
const addPrefix = p(CLS_PREFIX);

const { Header, Body } = Card;

const countLabelLength = list => {
  if (!list.length) return null;
  const titleLength = Math.max(
    ...list.map(item => {
      return item.title.length;
    })
  );
  if (titleLength > 7) {
    const length = parseInt(titleLength / 2.2, 10);
    return length > 7 ? 6 : length;
  }
  return null;
};

const countLabelText = title => {
  if (title.length > 14) {
    return `${title.substr(0, 14)}...`;
  }
  return title;
};

class InfoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      attachList: [],
      attachTitle: "",
    };
  }

  onClose = () => {
    this.setState({
      modal: false,
    });
  };

  show = (data, title) => {
    this.setState({
      modal: true,
      attachList: data,
      attachTitle: title,
    });
  };

  go = url => {
    window.location.href = url;
  };

  goDetail = path => {
    router.push(path);
  };

  render() {
    const { data } = this.props;
    const { modal, attachList, attachTitle } = this.state;
    const { title, list = [] } = data;
    const length = countLabelLength(list);
    return (
      <>
        <Card className={addPrefix("wrap")}>
          <Header className={addPrefix("title")} title={title} />
          <Body>
            {list.map(item => {
              if (item.type === "link") {
                return (
                  <div className={addPrefix("item")} key={item.id}>
                    <div className={addPrefix("label")}>{item.title}</div>
                    <div className={addPrefix("link-box")}>
                      {item.data.map(linkItem => {
                        if (linkItem.data) {
                          return (
                            <a
                              key={linkItem.id}
                              className={addPrefix("link")}
                              onClick={this.show.bind(
                                null,
                                linkItem.data,
                                linkItem.title
                              )}
                            >
                              {linkItem.title}
                            </a>
                          );
                        }
                        return (
                          <a
                            key={linkItem.id}
                            className={addPrefix("link")}
                            onClick={this.goDetail.bind(null, linkItem.path)}
                          >
                            {linkItem.title}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              } else if (item.type === "img") {
                return (
                  <div
                    className={cn(addPrefix("item"), {
                      [addPrefix("item-hide")]:
                        !item.value ||
                        (item.value.length === 0 && item.hideTitle),
                    })}
                    key={item.id}
                  >
                    <div
                      className={addPrefix("label")}
                      style={length ? { minWidth: `${length}0vw` } : {}}
                    >
                      {countLabelText(item.title)}
                    </div>
                    <div>
                      {Array.isArray(item.value) ? (
                        item.value.map(imgd => (
                          <img
                            src={imgd.fullUrl}
                            className={addPrefix("img")}
                            alt=""
                          />
                        ))
                      ) : (
                        <img
                          src={item.value}
                          className={addPrefix("img")}
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  className={cn(addPrefix("item"), {
                    [addPrefix("item-hide")]: !item.value && item.hideTitle,
                  })}
                  key={item.id}
                >
                  <div
                    className={addPrefix("label")}
                    style={length ? { minWidth: `${length}0vw` } : {}}
                  >
                    {countLabelText(item.title)}
                  </div>
                  <div className={addPrefix("text")}>{item.value}</div>
                </div>
              );
            })}
          </Body>
        </Card>
        <Modal
          popup
          visible={modal}
          onClose={this.onClose}
          animationType="slide-up"
          title={attachTitle}
          closable
        >
          <List className="popup-list">
            {attachList.map((item, index) => (
              <List.Item
                key={index}
                arrow="horizontal"
                onClick={this.go.bind(null, item.fileUrl)}
              >
                {item.name}
              </List.Item>
            ))}
            <List.Item></List.Item>
          </List>
        </Modal>
      </>
    );
  }
}

export default InfoComponent;
