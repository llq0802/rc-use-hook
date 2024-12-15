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
 * 使用窗口大小的自定义 Hook
 *
 * @param fn 窗口大小变化时执行的回调函数，参数为窗口大小对象
 * @param waitTime 防抖延时，默认为200毫秒
 * @returns 返回当前窗口大小对象
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
