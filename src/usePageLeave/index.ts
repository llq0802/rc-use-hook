import { useEventListener } from 'ahooks';
import { useState } from 'react';
/**
 * 监听页面离开事件，当鼠标移出页面或页面失去焦点时返回 true。
 *
 * 只要鼠标不在文档中，就认为页面已离开。包含`鼠标在标签页`或者`调试台`或者`切换浏览器标签页`
 *
 * @returns 返回页面是否已离开，如果鼠标移出页面或页面失去焦点则返回 true，否则返回 false。
 */
export default function usePageLeave(): boolean {
  const [isLeft, setIsLeft] = useState(false);

  const handler = (event: MouseEvent) => {
    // eslint-disable-next-line no-param-reassign
    event = event || (window.event as any);
    // @ts-ignore
    const from = event.relatedTarget || event.toElement;
    setIsLeft(!from);
  };

  useEventListener('mouseout', handler, {
    target: () => window,
    passive: true,
  });
  useEventListener('mouseleave', handler, {
    target: () => document,
    passive: true,
  });
  useEventListener('mouseenter', handler, {
    target: () => document,
    passive: true,
  });

  return isLeft;
}
