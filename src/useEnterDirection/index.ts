import { MutableRefObject, useEffect, useState } from 'react';
const PI = Math.PI;

enum Direction {
  top = 'top',
  left = 'left',
  right = 'right',
  bottom = 'bottom',
}

export default function useEnterDirection(
  target: MutableRefObject<HTMLDivElement | null> | (() => HTMLElement),
) {
  const [direction, setDirection] = useState<Direction>();

  useEffect(() => {
    if (!target) {
      return;
    }

    const dom =
      typeof target === 'function'
        ? target?.()
        : (target?.current as HTMLElement);

    const rect = dom?.getBoundingClientRect();
    const theta = Math.atan2(rect.height / 2, rect.width / 2);

    const mouseenter = (e: MouseEvent) => {
      const x = e.offsetX - rect.width / 2;
      const y = rect.height / 2 - e.offsetY;
      const d = Math.atan2(y, x);
      if (d < theta && d >= -theta) {
        setDirection(Direction.right);
      } else if (d >= theta && d < PI - theta) {
        setDirection(Direction.top);
      } else if (d >= PI - theta || d < -(PI - theta)) {
        setDirection(Direction.left);
      } else {
        setDirection(Direction.bottom);
      }
    };

    const mouseleave = () => {
      setDirection(void 0);
    };

    dom?.addEventListener('mouseenter', mouseenter);

    dom?.addEventListener('mouseleave', mouseleave);

    return () => {
      dom?.removeEventListener('mouseenter', mouseenter);
      dom?.removeEventListener('mouseleave', mouseleave);
    };
  }, []);

  return direction;
}
