"use client";

import React, { useState, useEffect, Suspense } from 'react';
import styles from "../styles/Result.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";  // Correct import statement

function ResultComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const result = searchParams.get("result");

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (result) {
                const prompt = `URL analysis: ${result}\nRespond only in JSON format:\n{\n"urlPatternYn": "Y/N",\n"benignOrMalicious": "Benign/Malicious",\n"patternFeature": ["malicious features in Korean"],\n"pobm": 0-100 // Probability of being malicious (%)\n}\nProvide JSON only, no other explanation.`
                try {
                    const response = await fetch('/api/analyzeUrl', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            prompt
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to analyze URL');
                    }

                    const data = await response.json();

                    if (!data.choices || data.choices.length === 0) {
                        throw new Error("No choices found in the response data");
                    }
                    const contentObject = JSON.parse(
                        data.choices[0].message.content.replace(/```json|```/g, "").trim()
                    );
                    setAnalysis(contentObject);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [result]);

    const handleBackClick = () => {
        router.push("/");
    };

    const handleRetryClick = () => {
        router.push("/scan"); // 다시 검사하기
    };

    return (
        <div className={styles.container}>
            <div className={styles.mobileContainer}>
                <div className={styles.header}>
                    <button onClick={handleBackClick} className={styles.backButton}>
                        ×
                    </button>
                    <h1 className={styles.title}>검사 결과</h1>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <>
                            <h2 className={styles.title2} style={{ color: analysis.benignOrMalicious === 'Malicious' ? '#d9534f' : '#5cb85c' }}>
                                {analysis.benignOrMalicious === 'Malicious' ? '큐싱 위험' : '정상'}
                            </h2>
                            <Image src="/test_qrcode.png" alt="QR Code" className={styles.qrCode} width={135} height={135} />

                            <div className={styles.qrUrl}>
                                {result ? decodeURIComponent(result) : "QR 스캔 정보가 없습니다."}
                            </div>

                            {analysis.benignOrMalicious === 'Malicious' && (
                                <div className={styles.warning}>
                                    <span className={styles.warningIcon}>⚠️</span>
                                    접속하지 마세요! 스미싱이 예상되는 악성 URL입니다.
                                </div>
                            )}

                            <div className={styles.infoContainer}>
                                <div className={styles.infoHeader}>
                                    <span className={styles.infoHeaderText}>오염 예상 지수 <img src="/warn.png" alt="Warning" className={styles.infoHeaderIcon} /> {analysis.pobm}%</span>
                                </div>

                                {/* <div className={styles.qrCodeContainer}>
                                    <img src="/test_qrcode.png" alt="QR Code" className={styles.qrCodeIcon} />
                                </div> */}
                                <div className={styles.infoDetail}>
                                    <div>
                                        <div className={styles.detailLabel}>큐싱 신고 횟수</div>
                                        <div className={styles.detailValue}>{analysis.benignOrMalicious === 'Malicious' ? '63' : '0'} 건</div>
                                    </div>
                                    <div>
                                        <div className={styles.detailLabel}>큐싱 의심 패턴</div>
                                        <div className={styles.detailValue}>{analysis.patternFeature.length}회 탐지</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <button onClick={handleRetryClick} className={styles.retryButton}>
                        다시 검사하기
                    </button>
                </div>
            </div>
        </div>
    );
}

function Result() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultComponent />
        </Suspense>
    );
}

export default Result;
