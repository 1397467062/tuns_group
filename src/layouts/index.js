import React from "react";
import { NavBar, Icon } from "antd-mobile";
import { connect } from "dva";
import styles from "./index.less";

const BasicLayout = props => {
  const { appSpace, children } = props;

  const {
    navBarLeftClick,
    navBarLeftIcon,
    navBarRightIcons,
    navBarTitle,
    hiddenNavBar,
    fullContent,
  } = appSpace;

  const navBarRightContent =
    navBarRightIcons && navBarRightIcons.length > 0 ? (
      <div className={styles.navbar_right_content}>
        {navBarRightIcons.map(navBarRightIcon => {
          return navBarRightIcon.icon ? (
            <Icon
              key={navBarRightIcon.icon || navBarRightIcon.text}
              className={styles.navbar_right_item}
              type={navBarRightIcon.icon}
              onClick={navBarRightIcon.onClick}
            />
          ) : navBarRightIcon.text ? (
            <div
              key={navBarRightIcon.icon || navBarRightIcon.text}
              className={styles.navbar_right_item}
              onClick={navBarRightIcon.onClick}
            >
              {navBarRightIcon.text}
            </div>
          ) : null;
        })}
      </div>
    ) : null;

  const { TUNS_GLOBAL } = window;
  const { SystemNavPaddingTop } = TUNS_GLOBAL;

  return (
    <>
      <div
        style={{ height: SystemNavPaddingTop, backgroundColor: "#FFFFFF" }}
      />
      {hiddenNavBar ? null : (
        <NavBar
          className={styles.navbar}
          mode="dark"
          icon={<Icon type={navBarLeftIcon} style={{ color: "#000000" }} />}
          onLeftClick={navBarLeftClick}
          rightContent={navBarRightContent}
        >
          {navBarTitle || ""}
        </NavBar>
      )}
      <div className={fullContent ? styles.full_content : styles.content}>
        {children}
      </div>
    </>
  );
};

export default connect(stores => ({ appSpace: stores.appSpace }))(BasicLayout);
