import { useLatest, useRafState } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useEffect } from 'react';

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
  onStart?: (position: Draggable) => void;
  onMove?: (position: Draggable) => void;
  onEnd?: (position: Draggable) => void;
};

function getBounding(ele: HTMLElement, val: Options['bounding']) {
  const bounding = {
    x: 0,
    y: 0,
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
  if (val === 'parent' && ele.parentElement) {
    const { top, left, width, height } =
      ele.parentElement.getBoundingClientRect();
    bounding.x = left;
    bounding.y = top;
    bounding.width = width;
    bounding.height = height;
  } else if (val && typeof val === 'object') {
    bounding.x = val.x;
    bounding.y = val.y;
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
  const [{ x, y }, setXY] = useRafState(
    () => opts?.defaultPosition || { x: 0, y: 0 },
  );

  const [moveing, setMoveing] = useRafState(false);
  const moveingRef = useLatest(moveing);

  useEffect(() => {
    const el = getTargetElement(ele);
    if (!el) return;

    el.style.touchAction = 'none';
    let startX = opts?.defaultPosition?.x || 0;
    let startY = opts?.defaultPosition?.y || 0;
    el.style.transform = `translate(${startX}px, ${startY}px)`;

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

      const { width: elWidth, height: elHeight } = el.getBoundingClientRect();
      startX = e.clientX - startX;
      startY = e.clientY - startY;

      const handleMove = (e: PointerEvent) => {
        const diffX = e.clientX - startX;
        const diffY = e.clientY - startY;
        // 计算新的位置并应用边界检查
        let newLeft = Math.max(
          boundingX,
          Math.min(diffX, boundingWidth - elWidth),
        );
        let newTop = Math.max(
          boundingY,
          Math.min(diffY, boundingHeight - elHeight),
        );
        el.style.transform = `translate(${newLeft}px, ${newTop}px)`;

        setXY({ x: newLeft, y: newTop });
        if (!moveingRef.current) setMoveing(true);
        opts?.onMove?.({ x: newLeft, y: newTop });
      };

      const handleUp = (e: PointerEvent) => {
        el.releasePointerCapture(e.pointerId);
        el.style.cursor = 'auto';
        startX = e.clientX - e.offsetX;
        startY = e.clientY - e.offsetY;
        setMoveing(false);
        opts?.onEnd?.({ x, y });
        el.removeEventListener('pointermove', handleMove);
        el.removeEventListener('pointerup', handleUp);
      };

      el.addEventListener('pointermove', handleMove);
      el.addEventListener('pointerup', handleUp);

      opts?.onStart?.({ x, y });
    };

    el.addEventListener('pointerdown', handleDown);

    return () => {
      el.removeEventListener('pointerdown', handleDown);
    };
  }, []);

  return { x, y, moveing };
}
