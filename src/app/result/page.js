"use client";

import React from "react";
import styles from "../styles/Result.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function Result() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const result = searchParams.get("result");

    const handleBackClick = () => {
        router.push("/scan"); // 스캔 페이지로 돌아가기
    };

    const handleRetryClick = () => {
        router.push("/scan"); // 다시 검사하기
    };

    return (
        <div className={styles.container}>
        <div className={styles.header}>
            <button onClick={handleBackClick} className={styles.backButton}>
            ×
            </button>
            <h1 className={styles.title}>검사 결과</h1>
        </div>

        <div className={styles.content}>
            <h2 className={styles.title} style={{ color: "#d9534f" }}>큐싱 의심</h2>
            <img src="https://via.placeholder.com/150" alt="QR Code" className={styles.qrCode} />

            <div className={styles.qrUrl}>
                {result ? decodeURIComponent(result) : "QR 스캔 정보가 없습니다."}
            </div>

            <div className={styles.warning}>
            <span className={styles.warningIcon}>⚠️</span>
                접속하지 마세요! 스미싱이 예상되는 악성 URL입니다.
            </div>

            <div className={styles.infoContainer}>
            <div className={styles.infoHeader}>
                <span className={styles.infoHeaderIcon}>📊</span>
                <span className={styles.infoHeaderText}>오염 예상 지수</span>
            </div>
            <div className={styles.infoScore}>97.3%</div>
            <div className={styles.infoDetail}>
                <div>
                <div className={styles.detailLabel}>의심 신고 횟수</div>
                <div className={styles.detailValue}>63 건</div>
                </div>
                <div>
                <div className={styles.detailLabel}>의심 의심 패턴</div>
                <div className={styles.detailValue}>8회 탐지</div>
                </div>
            </div>
            </div>

            <button onClick={handleRetryClick} className={styles.retryButton}>
            다시 검사하기
            </button>
        </div>
        </div>
    );
}
