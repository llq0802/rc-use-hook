import { useDeepCompareEffect, useLatest } from 'ahooks';
import { isFunction } from 'lodash-es';
import { useCallback, useRef, type MutableRefObject } from 'react';

export const useResizeObserver = (
  target: MutableRefObject<HTMLElement | null> | (() => HTMLElement),
  callback: ResizeObserverCallback,
  options: ResizeObserverOptions,
): (() => void) => {
  const savedCallback = useLatest(callback);
  const observerRef = useRef<ResizeObserver>();

  const stop = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);
  useDeepCompareEffect(() => {
    const dom: HTMLElement = isFunction(target)
      ? (target as () => HTMLElement)?.()
      : (target as MutableRefObject<HTMLElement>)?.current;
    if (!dom) {
      return;
    }
    observerRef.current = new ResizeObserver(savedCallback.current);
    observerRef.current.observe(dom, options);

    return stop;
  }, [savedCallback, stop, target, options]);

  return stop;
};
