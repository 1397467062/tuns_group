import React from "react";

const Title = props => {
  const { title } = props;
  return <span style={{ fontWeight: 600 }}>{title}</span>;
};

export default Title;
