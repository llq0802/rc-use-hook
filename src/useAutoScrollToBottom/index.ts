import { useUpdateEffect } from 'ahooks';

/**
 * 自动滚动到底部
 */
export const useAutoScrollToBottom = (
  container: HTMLDivElement,
  { effect = [], patch }: { effect?: any[]; patch?: () => boolean },
) => {
  useUpdateEffect(() => {
    if (!container) return;
    if (typeof patch === 'function' && !patch()) {
      return;
    }
    // 等价于nextick
    requestAnimationFrame(() => {
      setTimeout(() => {
        //@ts-ignore
        // 检测是否处于IE兼容模式
        if (document?.documentMode) {
          container.scrollTop = container.clientHeight + container.scrollTop;
        } else {
          container.scrollTop = container.scrollHeight;
        }
      }, 5);
    });
  }, [...effect]);
};
