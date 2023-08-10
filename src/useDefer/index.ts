import { startTransition, useEffect, useRef, useState } from 'react';

/**
 * 分片渲染长列表
 * @description 用于解决渲染时间过长导致白屏问题
 * @param maxFrameCount {number} 最大列表的数量
 * @default 1_000
 */
const useDefer = (maxFrameCount: number = 10_00) => {
  const [frameCount, setFrameCount] = useState(0);
  const frameCountRef = useRef(frameCount);
  // 防止闭包 获取到最新的 frameCount
  frameCountRef.current = frameCount;

  const rafId = useRef(0);

  useEffect(() => {
    const refreshFrameCount = () => {
      rafId.current = window.requestAnimationFrame(() => {
        if (frameCountRef.current < maxFrameCount) {
          // 变为过渡更新,防止阻塞ui
          startTransition(() => setFrameCount(frameCountRef.current + 1));
          refreshFrameCount();
        } else {
          window.cancelAnimationFrame(rafId.current);
        }
      });
    };

    refreshFrameCount();
  }, []);

  return (showInFrameCount: number) =>
    frameCountRef.current >= showInFrameCount;
};
export default useDefer;
