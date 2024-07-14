"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "../../styles/Scan.module.css";

const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

export default function Scan() {
  const [result, setResult] = useState("");
  const router = useRouter();

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);
      // 여기서 추가적인 동작을 수행할 수 있습니다.
      alert(`QR 코드 스캔 결과: ${data.text}`);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleBackClick = () => {
    router.push("/");
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>스캔 페이지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={styles.header}>
        <button onClick={handleBackClick} className={styles.backButton}>
          ←
        </button>
        <h1 className={styles.title}>스캔하기</h1>
      </div>

      <div className={styles.content}>
        <QrScanner
          delay={300}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
        <p className={styles.instruction}>인식된 QR 코드를 확인해주세요</p>
        {result && <p className={styles.result}>스캔 결과: {result}</p>}
      </div>
    </div>
  );
}
