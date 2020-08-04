import React from "react";
import p from "tuns-class-prefix";
import PropTypes from "prop-types";
import nodata from "./wsj.png";
import "./index.less";

const CLS_PREFIX = "tuns-group-nodata";
const addPrefix = p(CLS_PREFIX);

const NoData = props => {
  const { classNames, text, img } = props;
  return (
    <div className={`${addPrefix("wrap")} ${classNames}}`}>
      <img src={img || nodata} alt="" className={addPrefix("img")} />
      {text && <p>{text}</p>}
    </div>
  );
};

NoData.propTypes = {
  classNames: PropTypes.string,
  text: PropTypes.string,
  img: PropTypes.string,
};

NoData.defaultProps = {
  classNames: "",
  text: null,
  img: null,
};
export default NoData;
