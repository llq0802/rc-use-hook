import { useLatest, useRafState } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useEffect, useRef } from 'react';

export type Draggable = {
  x: number;
  y: number;
};

type Options = {
  defaultPosition?: Draggable;
  bounding?: 'viewport' | 'parent' | HTMLElement;
  onStart?: (position: Draggable, e: PointerEvent) => void;
  onMove?: (position: Draggable, e: PointerEvent) => void;
  onEnd?: (position: Draggable, e: PointerEvent) => void;
};

function getBounding(ele: HTMLElement, val: Options['bounding']) {
  const { width: elWidth, height: elHeight } = ele.getBoundingClientRect();
  const bounding = {
    maxX: document.documentElement.clientWidth - elWidth,
    maxY: document.documentElement.clientHeight - elHeight,
  };
  if (val === 'parent' && ele.parentElement) {
    ele.style.position = 'absolute';
    const { width, height } = ele.parentElement.getBoundingClientRect();
    bounding.maxX = width - elWidth;
    bounding.maxY = height - elHeight;
  } else if (val && typeof val === 'object' && val.getBoundingClientRect) {
    ele.style.position = 'absolute';
    const { width, height } = val.getBoundingClientRect();
    bounding.maxX = width - elWidth;
    bounding.maxY = height - elHeight;
  } else {
    ele.style.position = 'fixed';
  }
  return bounding;
}

/**
 * 可拖动组件的钩子函数
 * 该函数使指定的元素具有拖动功能，并可根据配置限制拖动范围
 *
 * @param ele 要拖动的元素或其选择器
 * @param opts 配置选项，包括拖动范围等
 */
export default function useDraggable(
  ele: Parameters<typeof getTargetElement>[0],
  opts?: Options,
) {
  const [xy, setXY] = useRafState<Draggable>(
    () => opts?.defaultPosition || { x: 0, y: 0 },
  );
  const offsetRef = useRef<Draggable>({ x: 0, y: 0 });
  const [moving, setMoving] = useRafState(false);
  const movingRef = useLatest(moving);
  const xyRef = useLatest<Draggable>(xy);

  useEffect(() => {
    const el = getTargetElement(ele);
    if (!el) return;
    el.style.touchAction = 'none';
    el.style.transform = `translate(${x}px, ${y}px)`;

    const { maxX, maxY } = getBounding(el, opts?.bounding || 'viewport');

    const handleDown = (e: PointerEvent) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'move';
      offsetRef.current.x = e.clientX - offsetRef.current.x;
      offsetRef.current.y = e.clientY - offsetRef.current.y;

      const handleMove = (e: PointerEvent) => {
        const diffX = e.clientX - offsetRef.current.x;
        const diffY = e.clientY - offsetRef.current.y;
        let newLeft = diffX;
        let newTop = diffY;

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
        setXY({ x: newLeft, y: newTop });
        if (!movingRef.current) setMoving(true);
        opts?.onMove?.({ x: newLeft, y: newTop }, e);
      };

      const handleUp = (e: PointerEvent) => {
        el.releasePointerCapture(e.pointerId);
        el.style.cursor = 'auto';
        offsetRef.current.x = xyRef.current.x;
        offsetRef.current.y = xyRef.current.y;
        setMoving(false);
        opts?.onEnd?.({ x: xyRef.current.x, y: xyRef.current.y }, e); // 使用最新的 x, y
        el.removeEventListener('pointermove', handleMove);
        el.removeEventListener('pointerup', handleUp);
      };

      el.addEventListener('pointermove', handleMove);
      el.addEventListener('pointerup', handleUp);

      opts?.onStart?.({ x: xyRef.current.x, y: xyRef.current.y }, e);
    };

    el.addEventListener('pointerdown', handleDown);

    return () => {
      el.removeEventListener('pointerdown', handleDown);
    };
  }, [xy]);

  const { x, y } = xy;
  return { x, y, moving };
}
