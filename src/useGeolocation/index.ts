import { useEffect, useState } from 'react';

const useGeolocation = () => {
  const [state, setState] = useState({
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: Date.now(),
  });

  useEffect(() => {
    const onEvent = (event) => {
      setState({
        accuracy: event.coords.accuracy,
        altitude: event.coords.altitude,
        altitudeAccuracy: event.coords.altitudeAccuracy,
        heading: event.coords.heading,
        latitude: event.coords.latitude,
        longitude: event.coords.longitude,
        speed: event.coords.speed,
        timestamp: event.timestamp,
      });
    };
    const onError = (error) => {
      console.warn(error);
      setState(error);
    };

    navigator?.geolocation?.getCurrentPosition(onEvent, onError);

    const watchId = navigator?.geolocation?.watchPosition(onEvent, onError);

    return () => {
      navigator?.geolocation?.clearWatch(watchId);
    };
  }, []);

  return state;
};
/**
 * 实用原生Web Api 获取定位信息
 * @author 李岚清 <https://github.com/llq0802>
 */
export default useGeolocation;
