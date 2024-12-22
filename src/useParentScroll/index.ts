import { getScrollableParent, getTargetElement } from 'rc-use-hooks/utils';
import { useEffect, useState } from 'react';

/**
 * 从给定的 ele 元素开始，遍历所有父元素直到 document 根元素。对于每个父节点，检查它是否是一个可滚动的节点。
 * @param target 目标元素
 * @returns 可滚动的元素
 */
const useScrollableParent = (
  target: Parameters<typeof getTargetElement>[0],
) => {
  const [scrollDom, setScrollDom] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const dom = getScrollableParent(getTargetElement(target));
    setScrollDom(dom);
  }, []);

  return scrollDom;
};

export default useScrollableParent;
