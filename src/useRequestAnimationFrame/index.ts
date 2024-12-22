import { useEffect, useRef } from 'react';

/**
 * 运行一个函数，在每次浏览器重绘之前调用它。
 * @params {(deltaTime: number) => void )} `deltaTime` 为每一次函数运行的间隔大多数为 16.7ms
 */
const useRequestAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: DOMHighResTimeStamp) => {
      if (previousTimeRef.current) {
        callback(time - previousTimeRef.current); //大约16.7ms
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current as number);
  }, []);
};

export default useRequestAnimationFrame;
