import { useLatest, useRafState } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useEffect, useLayoutEffect, useRef } from 'react';
interface UseSlideVerifyReturn {
  moveX: number;
  reset: () => void;
  moveing: boolean;
}
interface UseSlideVerifyOptions {
  initX?: number;
  maxMoveX?: number;
  onMouseDown?: (moveX: number) => void;
  onMouseMove?: (moveX: number) => void;
  onMouseUp?: (moveX: number) => void;
}

/**
 * 用于滑块验证滑动距离的 hook
 * 支持 PC 端、移动端、触摸笔
 * @param {(target: (() => HTMLElement) | React.RefObject<HTMLElement>) => HTMLElement} target 验证滑块的 DOM
 * @param {{
 *     initX?: number;
 *     maxMoveX?: number;
 *     onMouseDown?: (moveX: number) => void;
 *     onMouseMove?: (moveX: number) => void;
 *     onMouseUp?: (moveX: number) => void;
 *   }} options 配置项
 */
export default function useSlideVerify(
  target: Parameters<typeof getTargetElement>[0],
  {
    initX = 0,
    maxMoveX = 400,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }: UseSlideVerifyOptions = {},
): UseSlideVerifyReturn {
  const [dx, setDx] = useRafState(initX);
  const [moveing, setMoveing] = useRafState(false);
  const dxRef = useLatest(dx);
  const moveingRef = useLatest(moveing);
  const initXRef = useRef(initX);

  const reset = () => {
    setDx(initX);
    initXRef.current = initX;
  };

  useLayoutEffect(() => {
    const dom = getTargetElement(target);
    if (!dom) return;
    dom.style.transform = `translate3d(${dx}px, 0, 0)`;
    dom.style.transition = moveing ? 'none' : 'transform 0.3s';
  }, [dx, moveing]);

  useEffect(() => {
    const dom = getTargetElement(target);
    if (!dom) return;
    dom.style.touchAction = 'none';
    dom.style.userSelect = 'none';
    dom.style.cursor = 'move';

    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      dom.setPointerCapture(e.pointerId);
      const startX = e.pageX - initXRef.current;
      onMouseDown?.(startX);
      setMoveing(true);

      const handlePointerMove = (ev: PointerEvent) => {
        ev.preventDefault();
        if (!moveingRef.current) return;
        let newDx = ev.pageX - startX;
        if (newDx < 0) {
          newDx = 0;
        }
        if (newDx > maxMoveX) {
          newDx = maxMoveX;
        }
        onMouseMove?.(newDx);
        setDx(newDx);
      };

      const handlePointerUp = (evo: PointerEvent) => {
        evo.preventDefault();
        initXRef.current = dxRef.current;
        setMoveing(false);
        onMouseUp?.(dxRef.current);
        dom.removeEventListener('pointermove', handlePointerMove);
        dom.removeEventListener('pointerup', handlePointerUp);
      };

      dom.addEventListener('pointermove', handlePointerMove);
      dom.addEventListener('pointerup', handlePointerUp, { once: true });
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return { moveX: dx, reset, moveing };
}
