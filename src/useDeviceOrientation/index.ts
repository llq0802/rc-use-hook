import { useEffect, useState } from 'react';

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  });

  const handle = (e) => {
    setOrientation({
      beta: e.beta,
      alpha: e.alpha,
      gamma: e.gamma,
      absolute: e.absolute,
    });
  };

  useEffect(() => {
    window.addEventListener('deviceorientation', handle);

    return () => {
      window.removeEventListener('deviceorientation', handle);
    };
  }, []);

  return orientation;
};

export default useDeviceOrientation;
