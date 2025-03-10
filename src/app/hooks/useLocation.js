import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGeolocated } from 'react-geolocated';

const useLocation = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const getAddress = (address) => {
    const { county, city, borough } = address;
  
    if (county) return county;
    if (city === '서울') return borough;
    if (city && borough) return `${city} ${borough}`;
    if (city) return city;
    return null;
  };

  useEffect(() => {
    const fetchAddress = async (latitude, longitude) => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            format: 'json',
            lat: latitude,
            lon: longitude,
          },
        });

        const address = response.data.address;
        setAddress(getAddress(address));
      } catch (err) {
        setError('Failed to fetch address');
      }
    };

    if (coords) {
      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude });
      fetchAddress(latitude, longitude);
    } else if (!isGeolocationAvailable) {
      setError('Geolocation is not available');
    } else if (!isGeolocationEnabled) {
      setError('Geolocation is not enabled');
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  return { location, address, error };
};

export default useLocation;
