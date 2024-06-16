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
 * 返回窗口的宽高
 * @param waitTime 延迟时间
 * @return 窗口的宽高
 */
export default function useWindowSize(waitTime: number = 200) {
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
