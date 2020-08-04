import React from "react";
import Button from "tuns-mobile/lib/button";
import BottomButton from "tuns-mobile/lib/bottom";
import styles from "./index.less";

const ActionRender = ({ onNextClick }) => {
  return (
    <div className={styles.action}>
      <Button className={styles.btn} type="primary" onClick={onNextClick}>
        立即投保
      </Button>
    </div>
  );
};

const BottomActionComponent = props => {
  const { onNextClick, premium } = props;
  return (
    <div className={styles.root}>
      <BottomButton
        totalText="预计总保费"
        total={premium}
        renderAction={<ActionRender onNextClick={onNextClick} />}
        organization
        totalUnit="元"
      />
    </div>
  );
};

export default BottomActionComponent;
