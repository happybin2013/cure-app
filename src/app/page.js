"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import styles from "./styles/Home.module.css";
import ReportList from "./components/ReportList";

export default function Home() {
  const router = useRouter();

  const handleFabClick = () => {
    router.push("/scan");
  };

  const reports = ["따릉이 QR", "전동킥보드 QR"]; //@TODO: db조회로 변경

  return (
    <div className={styles.container}>
      <Head>
        <title>큐싱 위험도 지도</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={styles.mobileContainer}>
        <div className={styles.header}>QURE</div>
        <div className={styles.content}>
          <div className={styles.map}>
            <img src="/map_seoul.png" alt="지역별 큐싱 위험도 지도" />
          </div>
          <div className={styles.status}>오염 3 단계 입니다</div>
          <div className={styles.statusDescription}>
            은평구의 큐싱 청정도는 오염 3 단계 입니다.
          </div>
          <ReportList reports={reports} />
        </div>
      </div>

      <button className={styles.fab} onClick={handleFabClick}>
        QR
      </button>
    </div>
  );
}
