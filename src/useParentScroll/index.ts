import { isFunction } from 'rc-use-hook/utils';
import { MutableRefObject, useEffect, useState } from 'react';

const isScrollable = function (ele: HTMLElement) {
  const hasScrollableContent = ele?.scrollHeight > ele?.clientHeight;

  const overflowYStyle = window.getComputedStyle(ele).overflowY;

  const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

  return hasScrollableContent && !isOverflowHidden;
};

const getScrollableParent = function (ele) {
  if (!ele || ele === document.body) {
    return document.body;
  } else if (isScrollable(ele)) {
    return ele;
  } else {
    return getScrollableParent(ele?.parentNode);
  }
};

/**
 * 从给定的ele元素开始，遍历所有父元素直到document的根元素(document.body)。对于每个父节点，检查它是否是一个可滚动的节点。
 * @param target
 * @returns
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
