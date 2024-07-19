"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

import styles from "../styles/Scan.module.css";

export default function Scan() {
  const [result, setResult] = useState("");
  const qrCodeRef = useRef(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  const onScanSuccess = (decodedText) => {
    setResult(decodedText);
    if (qrCodeRef.current) {
      qrCodeRef.current.clear();
    }

    router.push(`/result?result=${encodeURIComponent(decodedText)}`);
  };
  
  useEffect(() => {
    const startQrScanner = async () => {
      try {
        const config = {
          fps: 10,
          rememberLastUsedCamera: true,
          aspectRatio: 1.0,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
          facingMode: { exact: "environment" }, // 모바일에서는 후면 카메라를 우선으로 사용
        };

        const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", config, false);
        qrCodeRef.current = html5QrcodeScanner;
        html5QrcodeScanner.render(onScanSuccess);
        setScannerInitialized(true); // 스캐너가 초기화되었음을 표시
      } catch (err) {
        console.error("Camera permission denied", err);
      }
    };

    if (!scannerInitialized) { // 초기화 여부 확인
      startQrScanner();
    }

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.clear();
        qrCodeRef.current = null; // 참조 해제
        setScannerInitialized(false);
      }
    };
  }, []);

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
        <div id="qr-reader" className={styles.qrReader}></div>
      </div>
      {scannerInitialized && <div className={styles.instruction}>의심되는 QR 코드를 인식해주세요</div>}
    </div>
  );
}
