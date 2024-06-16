import { getScrollableParent, isFunction } from 'rc-use-hooks/utils';
import { MutableRefObject, useEffect, useState } from 'react';

/**
 * 从给定的ele元素开始，遍历所有父元素直到document的根元素(document.body)。对于每个父节点，检查它是否是一个可滚动的节点。
 * @param target 目标元素
 * @returns 可滚动的元素
 */
const useScrollableParent = (
  target: MutableRefObject<HTMLElement | null> | (() => HTMLElement),
) => {
  const [scrollDom, setScrollDom] = useState(null);
  useEffect(() => {
    const ele = isFunction(target) ? target?.() : target?.current;
    const dom = getScrollableParent(ele);
    setScrollDom(dom);
  }, []);

  return scrollDom;
};

export default useScrollableParent;
