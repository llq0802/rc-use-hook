import { useState } from 'react';

/**
 * 分片渲染长列表
 * @description 用于解决渲染时间过长导致白屏问题
 * @param maxFrameCount {number} 最大列表的数量
 */
const useDefer = (maxFrameCount = 10_000) => {
  const [frameCount, setFrameCount] = useState(0);

  const refreshFrameCount = () => {
    window.requestAnimationFrame(() => {
      setFrameCount(frameCount + 1);
      if (frameCount < maxFrameCount) {
        refreshFrameCount();
      }
    });
  };

  refreshFrameCount();

  return (showInFrameCount: number) => frameCount >= showInFrameCount;
};
export default useDefer;
