import { getTargetElement } from 'rc-use-hooks/utils';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

let originalOverflow: string | null = null;

/**
 * 设置锁定元素的滚动, 常用于弹窗 抽屉等组件
 * @param lock 初始时是否锁定 默认为fasle
 * @param target  要锁定额度元素 默认为body
 * @param scrollW 滚动条宽度 默认17px
 * @return 返回锁定的状态和修改锁定的方法数组
 */
const useLockScroll = (
  lock = false,
  target: Parameters<typeof getTargetElement>[0] = () => document.body,
  scrollW = 17,
): [boolean, (bool: boolean) => void] => {
  const [locked, setLocked] = useState<boolean>(lock);

  const lockFn = useCallback(
    (dom: HTMLElement) => {
      if (dom === document.body || dom === document.documentElement) {
        const styleDom = document.createElement('style');
        styleDom.dataset.useLockScrollState = 'true';
        styleDom.innerHTML = `
       html, body {
          width: calc(100% - ${scrollW}px);
          overflow: hidden;
        }
      `;
        document.head.appendChild(styleDom);
        return;
      }
      originalOverflow = window.getComputedStyle(dom).overflow;
      dom.style.overflow = 'hidden';
    },
    [scrollW],
  );

  const unlockFn = useCallback((dom: HTMLElement) => {
    if (dom === document.body || dom === document.documentElement) {
      const styleDom = document.head.querySelector(
        'style[data-use-lock-scroll-state="true"]',
      );
      if (styleDom) styleDom.remove();
      return;
    }
    dom.style.overflow = originalOverflow as string;
    originalOverflow = null;
  }, []);

  useLayoutEffect(() => {
    const dom = getTargetElement(target);
    if (locked) {
      lockFn(dom);
    } else {
      unlockFn(dom);
    }
    return () => {
      originalOverflow = null;
    };
  }, [locked]);

  useEffect(() => {
    return () => setLocked(lock);
  }, []);

  const updateLocked = useCallback((bool: boolean) => setLocked(bool), []);
  return [locked, updateLocked];
};

export default useLockScroll;
