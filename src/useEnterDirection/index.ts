import { getTargetElement } from 'rc-use-hooks/utils';
import { useEffect, useState } from 'react';

const PI = Math.PI;
/**方向 */
export enum Direction {
  top = 'top',
  left = 'left',
  right = 'right',
  bottom = 'bottom',
}
/**
 * 精确的获取鼠标进入元素的方向
 * @param target dom 节点
 * @return {Direction} 鼠标进入元素的方向
 */
export default function useEnterDirection(
  target: Parameters<typeof getTargetElement>[0],
): Direction | undefined {
  const [direction, setDirection] = useState<Direction>();

  useEffect(() => {
    const dom = getTargetElement(target);
    if (!dom) return;
    const rect = dom?.getBoundingClientRect();
    const theta = Math.atan2(rect.height, rect.width);
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
    const mouseleave = () => setDirection(void 0);
    dom?.addEventListener('mouseenter', mouseenter);
    dom?.addEventListener('mouseleave', mouseleave);
    return () => {
      dom?.removeEventListener('mouseenter', mouseenter);
      dom?.removeEventListener('mouseleave', mouseleave);
    };
  }, []);

  return direction;
}
