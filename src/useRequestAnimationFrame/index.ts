import { useEffect, useRef } from 'react';

/**
 * 运行一个函数，在每次重绘之前调用它。
 * @author 李岚清 <https://github.com/llq0802>
 * @params {(deltaTime: number) => void )} deltaTime为每一次函数运行的间隔大多数为16.7ms
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