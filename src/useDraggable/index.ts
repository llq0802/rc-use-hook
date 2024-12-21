import { useLatest, useRafState } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useEffect, useRef } from 'react';

export type Draggable = {
  x: number;
  y: number;
};

type Options = {
  defaultPosition?: Draggable;
  bounding?:
    | 'viewport'
    | 'parent'
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      };
  onStart?: (position: Draggable, e: PointerEvent) => void;
  onMove?: (position: Draggable, e: PointerEvent) => void;
  onEnd?: (position: Draggable, e: PointerEvent) => void;
};

function getBounding(ele: HTMLElement, val: Options['bounding']) {
  const bounding = {
    x: 0,
    y: 0,
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
  if (val === 'parent' && ele.parentElement) {
    const { width, height } = ele.parentElement.getBoundingClientRect();

    bounding.x = 0;
    bounding.y = 0;
    bounding.width = width;
    bounding.height = height;
  } else if (val && typeof val === 'object') {
    bounding.x = 0;
    bounding.y = 0;
    bounding.width = val.width;
    bounding.height = val.height;
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

    const {
      x: boundingX,
      y: boundingY,
      width: boundingWidth,
      height: boundingHeight,
    } = getBounding(el, opts?.bounding || 'viewport');

    const handleDown = (e: PointerEvent) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'move';

      console.log('===boundingWidth===>', boundingWidth);
      console.log('===boundingHeight===>', boundingHeight);

      const { width: elWidth, height: elHeight } = el.getBoundingClientRect();
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
        if (newLeft > boundingWidth - elWidth) {
          newLeft = boundingWidth - elWidth;
        }
        if (newTop < 0) {
          newTop = 0;
        }
        if (newTop > boundingHeight - elHeight) {
          newTop = boundingHeight - elHeight;
        }

        el.style.transform = `translate(${newLeft}px, ${newTop}px)`;
        setXY({ x: newLeft, y: newTop });
        if (!movingRef.current) setMoving(true);
        opts?.onMove?.({ x: newLeft, y: newTop }, e);
      };

      const handleUp = (e: PointerEvent) => {
        el.releasePointerCapture(e.pointerId);
        console.log('===xyRef.current===>', xyRef.current);
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
