import { useState, useEffect } from 'react';
import axios from 'axios';

const useReports = (region_name) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      if (region_name) {
        try {
          const response = await axios.get("http://localhost/api/report/cntn/" + region_name);
          setReports(response.data);
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      }
    };
    fetchReports();
  }, [region_name]);

  return reports;
};

export default useReports;
