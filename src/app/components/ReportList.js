import React from "react";
import styles from "../styles/ReportList.module.css";

const ReportList = ({ address, reports }) => {
  return (
    <div className={styles.report}>
      <div className={styles.reportTitle}>{address} 큐싱 신고 내역</div>
      {reports.map((report, index) => (
        <div key={index} className={styles.reportItem}>
          {report}
        </div>
      ))}
    </div>
  );
};

export default ReportList;
