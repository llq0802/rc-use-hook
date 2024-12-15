import { debounce } from 'lodash-es';
import { useEffect, useState } from 'react';

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
    dpr: window.devicePixelRatio,
  };
}

/**
 * 使用窗口大小变化的 Hook
 *
 * @param fn 窗口大小变化时的回调函数，可选参数
 * @param waitTime 防抖的等待时间，默认为 200 毫秒
 * @returns 当前窗口的大小
 */
export default function useWindowSize(
  fn?: (size: ReturnType<typeof getSize>) => void,
  waitTime: number = 200,
) {
  const [windowSize, setWindowSize] = useState(() => getSize());
  useEffect(() => {
    const handleResize = debounce(function () {
      const size = getSize();
      setWindowSize(size);
      fn?.(size);
    }, waitTime);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
}
