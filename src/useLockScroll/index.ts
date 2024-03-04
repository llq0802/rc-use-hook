import {
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

let originalOverflow: string | null = null;

/**
 * 设置锁定元素的滚动, 常用于弹窗 抽屉等组件
 * @author 李岚清 <https://github.com/llq0802>
 * @param lock 初始是否锁定 默认为fasle
 * @param target  要锁定额度元素 默认为body
 * @return 返回锁定的状态和修改锁定的方法数组
 */
const useLockScroll = (
  lock = false,
  target: MutableRefObject<HTMLElement | null> | (() => Element) = () =>
    document.body,
  scrollW = 17,
): [boolean, (bool: boolean) => void] => {
  const [locked, setLocked] = useState<boolean>(lock);

  const lockFn = useCallback((dom) => {
    if (dom === document.body) {
      const styleDom = document.createElement('style');
      styleDom.dataset.useLockScrollState = 'true';
      styleDom.innerHTML = `
       html body {
          width: calc(100% - ${scrollW}px);
          overflow: hidden;
        }
      `;
      document.head.appendChild(styleDom);
      return;
    }
    originalOverflow = window.getComputedStyle(dom).overflow;
    dom.style.overflow = 'hidden';
  }, []);

  const unlockFn = useCallback((dom) => {
    if (dom === document.body) {
      const styleDom = document.head.querySelector(
        'style[data-use-lock-scroll-state="true"]',
      );
      if (styleDom) {
        styleDom.remove();
      }
      return;
    }
    dom.style.overflow = originalOverflow as string;
    originalOverflow = null;
  }, []);

  useLayoutEffect(() => {
    const dom: Element =
      typeof target === 'function' ? target?.() : target?.current;

    if (locked) {
      lockFn(dom);
    } else {
      unlockFn(dom);
    }
  }, [locked]);

  useEffect(() => {
    return () => setLocked(lock);
  }, []);

  const updateLocked = useCallback((bool: boolean) => setLocked(bool), []);

  return [locked, updateLocked];
};

export default useLockScroll;
