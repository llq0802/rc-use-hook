import { useEffect, useRef } from 'react';

/**
 * 运行一个函数，在每次重绘之前调用它。
 * @params {(deltaTime: number) => void )} callback
 */
const useRequestAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

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
