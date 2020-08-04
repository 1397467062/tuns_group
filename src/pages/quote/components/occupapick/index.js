
import React from "react";
import { PickerView, Button } from "antd-mobile";
import p from "tuns-class-prefix";
import "./index.less"

const CLS_PREFIX = "tuns-team-form-pickermodal";
const addPrefix = p(CLS_PREFIX);

class OccupaPick extends React.Component {
  constructor(props) {
    super(props)
    let valueS = null
    if (props.data.length > 1) {
      const [{ value }] = props.data
      valueS = value
      valueS = props.value || value
    }
    this.state = {
      value: [valueS],
    };
  }


  onScrollChange = (value) => {
    this.setState({
      value,
    });

  }

  onOk = () => {
    const { onChange, onClose } = this.props
    const { value } = this.state
    if (typeof onChange === "function") {
      onChange(value && value.join(","));
      onClose();
    }
  }

  render() {
    const { value } = this.state
    const { onClose, data = [] } = this.props;
    return (
      <div>
        <div className={addPrefix("action")}>
          <Button onClick={onClose} className={addPrefix("cancel")}>
            取消
          </Button>
          选择时间
          <Button onClick={this.onOk} className={addPrefix("ok")}>
            确定
          </Button>
        </div>
        <PickerView
          data={data}
          cascade={false}
          value={value}
          onScrollChange={this.onScrollChange}
        />
      </div>
    );
  }
}
export default OccupaPick;