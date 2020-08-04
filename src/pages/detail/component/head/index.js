import React from "react";
import styles from "./index.less";

const Header = props => {
  const { img = "", title, brief } = props;
  return (
    <div className={styles.root}>
      <img src={img} alt="" />
      <div className={styles.head}>
        <p className={styles.title}>{title}</p>
        <p>{brief}</p>
      </div>
    </div>
  );
};

export default Header;
