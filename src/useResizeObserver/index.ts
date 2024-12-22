import { useDeepCompareEffect, useLatest } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useCallback, useRef } from 'react';
/**
 * 用于观察指定元素的尺寸变化并调用回调函数 支持数组dom
 *
 * 主要用途是封装ResizeObserver，使其更方便地在React组件中使用
 *
 * @param target 要观察其尺寸变化的元素的引用或选择器
 * @param callback 当观察的元素尺寸变化时的回调函数
 * @param options ResizeObserver的配置选项
 */
const useResizeObserver = (
  target: Parameters<typeof getTargetElement>[0],
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions,
) => {
  const savedCallback = useLatest(callback);
  const observerRef = useRef<ResizeObserver>();
  const stop = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);
  useDeepCompareEffect(() => {
    const dom = getTargetElement(target);
    if (!dom) return;
    observerRef.current = new ResizeObserver(savedCallback.current);
    observerRef.current.observe(dom, options);
    return stop;
  }, [savedCallback, target, options]);

  return stop;
};

export default useResizeObserver;
