"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "../styles/Scan.module.css";

export default function Scan() {
  const [result, setResult] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const qrCodeRef = useRef(null);
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  const handleScanSuccess = (decodedText) => {
    setResult(decodedText);
    setShowScanner(false);
    qrCodeRef.current.clear();
  };

  const handleButtonClick = () => {
    setShowScanner(true);
  };

  useEffect(() => {
    if (showScanner) {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      const html5QrCode = new Html5QrcodeScanner("qr-reader", config, false);
      qrCodeRef.current = html5QrCode;
      html5QrCode.render(handleScanSuccess);
    }

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.clear();
      }
    };
  }, [showScanner]);

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
        <button onClick={handleButtonClick} className={styles.scanButton}>
          스캔하기
        </button>
        {showScanner && <div id="qr-reader" className={styles.qrReader}></div>}
        <p className={styles.instruction}>인식된 QR 코드를 확인해주세요</p>
        {result && <p className={styles.result}>스캔 결과: {result}</p>}
      </div>
    </div>
  );
}
