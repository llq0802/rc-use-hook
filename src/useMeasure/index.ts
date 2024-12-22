import type { getTargetElement } from 'rc-use-hooks/utils';
import { useState } from 'react';
import useResizeObserver from '../useResizeObserver';

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
};
const defaultState: Rect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

/**
 * 用于测量HTML元素的`尺寸`和`位置`
 *
 * `ahooks` 的 `useSize` 只会返回 width 和 height
 *
 * 它基于Resize Observer API，提供了一种简单的方法来获取元素的实时大小和位置信息
 *
 * @param target 要测量的HTML元素的引用，可以是MutableRefObject类型或者返回HTMLElement的函数
 * @param options 传递给ResizeObserver的选项，用于配置观察行为
 * @returns 返回一个包含元素尺寸和位置信息的矩形对象，以及一个用于停止观察的函数
 */
const useMeasure = (
  target: Parameters<typeof getTargetElement>[0],
  options?: ResizeObserverOptions,
) => {
  const [rect, setRect] = useState(defaultState);

  useResizeObserver(
    target || document.body,
    (entries) => {
      if (entries[0]) {
        const { x, y, width, height, top, left, bottom, right } =
          entries[0].contentRect;
        setRect({ x, y, width, height, top, left, bottom, right });
      }
    },
    options,
  );

  return rect;
};
export default useMeasure;
