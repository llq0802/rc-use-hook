import { useLatest } from 'ahooks';
import { useEffect, useState, type MutableRefObject } from 'react';

type Draggable = {
  x: number;
  y: number;
};

type Options = {
  bounding?:
    | 'viewport'
    | 'parent'
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      };
  onStart?: () => void;
  onMove?: () => void;
  onEnd?: () => void;
};

export default function useDraggable(
  ele: MutableRefObject<HTMLElement | null> | (() => HTMLElement),
  opts: Options,
) {
  const [{ x, y }, setXY] = useState({ x: 0, y: 0 });
  const [moveing, setMoveing] = useState(false);
  const moveingRef = useLatest(moveing);

  const bounding = opts?.bounding || 'viewport';

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const handlePointerDown = function (e) {
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'move';
      startX = e.pageX - startX;
      startY = e.pageY - startY;
      const handleMove = (e) => {
        const diffX = e.pageX - startX;
        const diffY = e.pageY - startY;
        const { top, left, width, height } = el.getBoundingClientRect();
        // 计算新的位置
        let newLeft = diffX;
        let newTop = diffY;
        // 限制在视口内
        // newLeft 小于  el.parentElement.getBoundingClientRect().left 可限制在父元素内移动
        if (newLeft < 0) {
          newLeft = 0;
        }
        // window.innerWidth 替换成  el.parentElement.offsetWidth 可限制在父级元素内移动
        if (newLeft > window.innerWidth - el.offsetWidth) {
          newLeft = window.innerWidth - el.offsetWidth;
        }
        // newLeft 小于  el.parentElement.getBoundingClientRect().top 可限制在父元素内移动
        if (newTop < 0) {
          newTop = 0;
        }
        // window.innerHeight 替换成 el.parentElement.offsetHeight 可限制在父级元素内移动
        if (newTop > window.innerHeight - el.offsetHeight) {
          newTop = window.innerHeight - el.offsetHeight;
        }
        el.style.transform = `translate(${newLeft}px, ${newTop}px)`;
        setXY({ x: newLeft, y: newTop });
        if (!moveingRef.current) setMoveing(true);
      };
      const handleUp = (e) => {
        startX = e.pageX - e.offsetX;
        startY = e.pageY - e.offsetY;
        el.style.cursor = 'auto';
        el.removeEventListener('pointermove', handleMove);
        el.removeEventListener('pointerup', handleUp);
        setMoveing(false);
      };

      el.addEventListener('pointermove', handleMove);
      el.addEventListener('pointerup', handleUp);
    };

    const el = typeof ele === 'function' ? ele() : ele.current!;
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', handlePointerDown);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return {
    x,
    y,
    moveing,
  };
}
