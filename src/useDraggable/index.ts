import { useLatest, useRafState } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useLayoutEffect, useRef } from 'react';

export type Position = {
  x: number;
  y: number;
};

export type UseDraggableOptions = {
  /**
   * 拖动元素的默认位置。
   * 如果未提供，则默认为 { x: 0, y: 0 }。
   */
  defaultPosition?: Position;

  /**
   * 拖动元素的边界限制。
   * 可以是 'viewport'（视口）、'parent'（父元素）或自定义的 HTMLElement。
   */
  bounding?: 'viewport' | 'parent' | HTMLElement;

  /**
   * 拖动开始时的回调函数。
   * 在拖动开始时触发，接收当前的位置和 PointerEvent 对象。
   */
  onStart?: (position: Position, e: PointerEvent) => void;

  /**
   * 拖动过程中移动时的回调函数。
   * 在每次移动时触发，接收当前的位置和 PointerEvent 对象。
   */
  onMove?: (position: Position, e: PointerEvent) => void;

  /**
   * 拖动结束时的回调函数。
   * 在拖动结束时触发，接收最终的位置和 PointerEvent 对象。
   */
  onEnd?: (position: Position, e: PointerEvent) => void;
};

type UseDraggableReturn = Position & {
  /**是否正在移动 */
  moving: boolean;
};

function getBounding(ele: HTMLElement, val: UseDraggableOptions['bounding']) {
  const { width: elWidth, height: elHeight } = ele.getBoundingClientRect();
  const bounding = {
    maxX: document.documentElement.clientWidth - elWidth,
    maxY: document.documentElement.clientHeight - elHeight,
  };
  if (val === 'parent' && ele.parentElement) {
    const { width, height } = ele.parentElement.getBoundingClientRect();
    ele.parentElement.style.position = 'relative';
    ele.style.position = 'absolute';
    bounding.maxX = width - elWidth;
    bounding.maxY = height - elHeight;
  } else if (
    val &&
    typeof val === 'object' &&
    typeof val.getBoundingClientRect === 'function'
  ) {
    const { width, height } = val.getBoundingClientRect();
    ele.style.position = 'absolute';
    bounding.maxX = width - elWidth;
    bounding.maxY = height - elHeight;
  } else {
    ele.style.position = 'fixed';
  }
  return bounding;
}

/**
 * 高性能的可拖动组件的钩子函数。
 *
 * 支持 `PC端` `移动端`和`触控笔设备`。
 *
 * 该函数使指定的元素具有拖动功能，并可根据配置限制拖动范围和初始位置。
 *
 * @param ele - 要拖动的元素或其选择器
 * @param opts - 配置选项，包括拖动范围等
 * @returns 包含当前坐标和是否正在拖动的对象
 */
export default function useDraggable(
  ele: Parameters<typeof getTargetElement>[0],
  opts?: UseDraggableOptions,
): UseDraggableReturn {
  const [xy, setXY] = useRafState<Position>(
    () => opts?.defaultPosition || { x: 0, y: 0 },
  );
  // 使用最新的 x, y
  const xyRef = useLatest(xy);
  const [moving, setMoving] = useRafState(false);
  const movingRef = useLatest(moving);
  const offsetRef = useRef<Position>(opts?.defaultPosition || { x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = getTargetElement(ele);
    if (!el) return;
    el.style.cursor = 'grab';
    el.style.userSelect = 'none';
    el.style.touchAction = 'none';
    el.style.transform = `translate(${xy.x}px, ${xy.y}px)`;
    const { maxX, maxY } = getBounding(el, opts?.bounding || 'viewport');

    const handleDown = (e: PointerEvent) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
      offsetRef.current.x = e.clientX - offsetRef.current.x;
      offsetRef.current.y = e.clientY - offsetRef.current.y;
      opts?.onStart?.({ x: xyRef.current.x, y: xyRef.current.y }, e);

      const handleMove = (e: PointerEvent) => {
        e.preventDefault();
        let newLeft = e.clientX - offsetRef.current.x;
        let newTop = e.clientY - offsetRef.current.y;
        // 计算新的位置并应用边界检查
        if (newLeft < 0) {
          newLeft = 0;
        }
        if (newLeft > maxX) {
          newLeft = maxX;
        }
        if (newTop < 0) {
          newTop = 0;
        }
        if (newTop > maxY) {
          newTop = maxY;
        }
        el.style.transform = `translate(${newLeft}px, ${newTop}px)`;
        opts?.onMove?.({ x: newLeft, y: newTop }, e);
        setXY({ x: newLeft, y: newTop });
        if (!movingRef.current) {
          setMoving(true);
        }
      };

      const handleUp = (e: PointerEvent) => {
        e.preventDefault();
        el.releasePointerCapture(e.pointerId);
        el.style.cursor = 'grab';
        offsetRef.current.x = xyRef.current.x;
        offsetRef.current.y = xyRef.current.y;
        setMoving(false);
        opts?.onEnd?.({ x: xyRef.current.x, y: xyRef.current.y }, e);
        el.removeEventListener('pointermove', handleMove);
        el.removeEventListener('pointerup', handleUp);
      };

      el.addEventListener('pointermove', handleMove, false);
      el.addEventListener('pointerup', handleUp, false);
    };

    el.addEventListener('pointerdown', handleDown, false);

    return () => {
      el.removeEventListener('pointerdown', handleDown);
    };
  }, [opts?.bounding]);

  return { ...xy, moving };
}
