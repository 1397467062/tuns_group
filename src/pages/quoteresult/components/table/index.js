import React from "react";
import MultipleTable from "tuns-mobile/lib/table";

import styles from "./index.less";


const TableDemo = ({ columns = [], datas = [] }) => {
  const rowHeader = {
    title: "保险责任",
    dataIndex: "insurance_liability",
    key: "insurance_liability",
    width: 150,
  };
  return (
    <div className={styles.main}>
      <MultipleTable
        rowHeader={rowHeader}
        columns={columns}
        datas={datas}
        onClickColumnHeader={(data, sectionIndex, column, columnIndex) => {
          // 至少保留一列 如果 columns 发成长度变化会自动刷新
          if (columns.length > 1) {
            columns.splice(columnIndex, 1);
          }
        }}
      />
    </div>
  );
};

export default TableDemo;