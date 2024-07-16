"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import styles from "./styles/Home.module.css";
import ReportList from "./components/ReportList";
import useLocation from "./hooks/useLocation";
import SeoulMapSvg from "./components/SeoulMapSvg";
import GyeonggiMapSvg from "./components/GyeonggiMapSvg";

export default function Home() {
  const router = useRouter();
  const { location, address, error } = useLocation();

  const handleFabClick = () => {
    router.push("/scan");
  };

  const reports = ["따릉이 QR", "전동킥보드 QR"]; //@TODO: db조회로 변경

  const seoulDistricts = [
    "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", 
    "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", 
    "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"
  ];

  const gyeonggiDistricts = [
    "수원시 장안구", "수원시 권선구", "수원시 팔달구", "수원시 영통구", 
    "성남시 수정구", "성남시 중원구", "성남시 분당구", "의정부시", 
    "안양시 만안구", "안양시 동안구", "부천시", "광명시", "평택시", "동두천시", 
    "안산시 상록구", "안산시 단원구", "고양시 덕양구", "고양시 일산동구", "고양시 일산서구", 
    "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", 
    "용인시 처인구", "용인시 기흥구", "용인시 수지구", "파주시", "이천시", "안성시", 
    "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"
  ];

  // 주소가 서울인지 판단하는 함수
  const isSeoul = (address) => {
    if (!address) return false;
    return seoulDistricts.some(district => address.includes(district));
  };

  // 주소가 경기도인지 판단하는 함수
  const isGyeonggi = (address) => {
    if (!address) return false;
    return gyeonggiDistricts.some(district => address.includes(district));
  };

  // 적절한 지도 컴포넌트 선택
  const MapComponent = () => {
    if (isSeoul(address)) {
      return <SeoulMapSvg address={address} />;
    } else if (isGyeonggi(address)) {
      return <GyeonggiMapSvg address={address} />;
    } else {
      return <div>지원되지 않는 지역입니다.</div>;
    }
  };

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
            <MapComponent />
          </div>
          <div className={styles.statusDescription}>
            {address ? `${address}의 큐싱 청정도는 오염 3 단계 입니다.` : '행정구역 정보를 가져오는 중...'}
          </div>
          <ReportList address={address} reports={reports} />
        </div>
      </div>

      <button className={styles.fab} onClick={handleFabClick}>
        QR
      </button>
    </div>
  );
}
