import React from "react";
import { List, Card } from "antd-mobile"; // WhiteSpace
import styles from "./index.less";

const { Item } = List;

class ParameterList extends React.Component {
  render() {
    const { props } = this;
    const { parametersValues, parameters } = props;
    parameters.forEach(parameter => {
      const { key } = parameter;
      if (Object.prototype.hasOwnProperty.call(parametersValues, key)) {
        let showValue = parametersValues[key];
        const { options } = parameter;
        if (showValue && options && options.length) {
          for (let i = 0, { length } = options; i < length; i += 1) {
            const option = options[i];
            if (showValue === option.value) {
              showValue = option.label;
            }
          }
        }
        parameter.showValue = showValue;
      }
    });

    const renderItem = parameter => {
      const { title, key, showValue } = parameter;

      return (
        <Item key={key} extra={showValue}>
          {title}
        </Item>
      );
    };

    return (
      <div className={styles.root}>
        <Card full>
          <Card.Header title="报价单" />
          <Card.Body>
            <List>{parameters.map(parameter => renderItem(parameter))}</List>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default ParameterList;
