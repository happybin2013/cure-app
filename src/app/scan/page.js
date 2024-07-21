"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

import styles from "../styles/Scan.module.css";

export default function Scan() {
  const [result, setResult] = useState("");
  const qrCodeRef = useRef(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  const onScanSuccess = (decodedText) => {
    setResult(decodedText);
    if (qrCodeRef.current) {
      qrCodeRef.current.stop().then(() => {
        console.log("Scanner stopped.");
      }).catch(err => console.error("Failed to stop scanner:", err));
    }
    
    setTimeout(() => {
      setIsReady(false);
      router.push(`/result?result=${encodeURIComponent(decodedText)}`);
    }, 100);
  };

  const initializeScanner = async () => {
    if (qrCodeRef.current) {
      await qrCodeRef.current.stop();
      qrCodeRef.current = null;
    }

    try {
      const config = {
        fps: 10,
        rememberLastUsedCamera: true,
        aspectRatio: 1.0,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      };

      const html5QrCode = new Html5Qrcode("qr-reader");
      qrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        (errorMessage) => {
          console.log(errorMessage);
        }
      );
      setScannerInitialized(true);
      setIsReady(true);
    } catch (err) {
      console.error("Camera permission denied or error occurred", err);
    }
  };

  useEffect(() => {
    setIsReady(false);
    setScannerInitialized(false);
    initializeScanner();

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().then(() => {
          qrCodeRef.current = null;
          setScannerInitialized(false);
          setIsReady(false);
        }).catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>스캔 페이지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={styles.mobileContainer}>
        <div className={styles.header}>
          <button onClick={handleBackClick} className={styles.backButton}>
            ←
          </button>
          <h1 className={styles.title}>스캔하기</h1>
        </div>

        <div className={styles.content}>
          <div id="qr-reader" className={styles.qrReader}></div>
        </div>
        {isReady && <div className={styles.instruction}>의심되는 QR 코드를 인식해주세요</div>}
      </div>
    </div>
  );
}