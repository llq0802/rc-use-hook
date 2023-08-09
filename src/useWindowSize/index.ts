import { debounce } from 'lodash-es';
import { useEffect, useState } from 'react';

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

/**
 * 实时返回窗口的宽高
 */
export default function useWindowSize(waitTime = 200) {
  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    const handleResize = debounce(function () {
      setWindowSize(getSize());
    }, waitTime);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
