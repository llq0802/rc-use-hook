const isScrollable = function (ele: HTMLElement) {
  const hasScrollableContent = ele.scrollHeight > ele.clientHeight;
  const overflowYStyle = window.getComputedStyle(ele).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;
  return hasScrollableContent && !isOverflowHidden;
};

const getScrollableParent = function (ele) {
  return !ele || ele === document.body
    ? document.body
    : isScrollable(ele)
    ? ele
    : getScrollableParent(ele.parentNode);
};
