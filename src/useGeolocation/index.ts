import { useEffect, useState } from 'react';

/**
 * 实用原生Web Api 获取定位信息
 * @author 李岚清 <https://github.com/llq0802>
 */
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
  let watchId: number | undefined;

  useEffect(() => {
    const onEvent = (event) => {
      console.log('event', event);
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

    const onError = (error) => setState(error);

    navigator?.geolocation?.getCurrentPosition(onEvent, onError);
    watchId = navigator?.geolocation?.watchPosition(onEvent, onError);

    return () => {
      navigator?.geolocation?.clearWatch(watchId as number);
    };
  }, []);

  return state;
};

export default useGeolocation;
