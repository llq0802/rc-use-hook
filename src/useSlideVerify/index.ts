import { useLatest, useRafState } from 'ahooks';
import { useEffect, useLayoutEffect } from 'react';

/**
 *用于滑块验证滑动距离的hook
 *支持PC端 移动端 以及触摸笔
 * @param {((() => HTMLElement) | React.RefObject<HTMLElement>)} el 验证滑块的dom
 * @param {{ maxMoveX?: number; onMouseUp?: (moveX: number) => void }} [{
 *     maxMoveX = 400,
 *     onMouseUp,
 *   }={}]  配置项
 */
export default function useSlideVerify(
  el: (() => HTMLElement) | React.RefObject<HTMLElement>,
  {
    maxMoveX = 400,
    onMouseUp,
  }: { maxMoveX?: number; onMouseUp?: (moveX: number) => void } = {},
) {
  const [dx, setDx] = useRafState(0);
  const [moveing, setMoveing] = useRafState(false);
  const dxRef = useLatest(dx);
  const reset = () => setDx(0);

  useLayoutEffect(() => {
    const dom = typeof el === 'function' ? el() : (el.current as HTMLElement);
    dom.style.transform = `translate3d(${dx}px, 0, 0)`;
    dom.style.transition = moveing ? 'none' : 'transform 0.3s';
  }, [dx, moveing]);

  useEffect(() => {
    const dom = typeof el === 'function' ? el() : (el.current as HTMLElement);
    const handlePointerDown = (e) => {
      setMoveing(true);

      e.preventDefault();
      dom.setPointerCapture(e.pointerId);
      const startX = e.pageX - dx;

      const handlePointerMove = (ev) => {
        ev.preventDefault();
        let newDx = ev.pageX - startX;
        if (newDx < 0) {
          newDx = 0;
        }
        if (newDx > maxMoveX) {
          newDx = maxMoveX;
        }

        setDx(newDx);
      };

      const handlePointerUp = () => {
        setMoveing(false);
        onMouseUp?.(dxRef.current);
        dom.removeEventListener('pointermove', handlePointerMove);
      };

      dom.addEventListener('pointermove', handlePointerMove);
      dom.addEventListener('pointerup', handlePointerUp, { once: true });
    };

    dom.addEventListener('pointerdown', handlePointerDown);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [dx]);

  return { moveX: dx, reset };
}

// export default function useDraggable(el) {
//   const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 });

//   useEffect(() => {
//     const handleMouseDown = (event) => {
//       const startX = event.pageX - dx;
//       const startY = event.pageY - dy;
//       const handleMouseMove = (event) => {
//         const newDx = event.pageX - startX;
//         const newDy = event.pageY - startY;
//         setOffset({ dx: newDx, dy: newDy });
//       };
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener(
//         'mouseup',
//         () => {
//           document.removeEventListener('mousemove', handleMouseMove);
//         },
//         { once: true },
//       );
//     };
//     el.current.addEventListener('mousedown', handleMouseDown);
//     return () => {
//       el.current.removeEventListener('mousedown', handleMouseDown);
//     };
//   }, [dx, dy]);

//   useLayoutEffect(() => {
//     el.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
//   }, [dx, dy]);
// }
