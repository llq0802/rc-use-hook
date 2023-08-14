import { isFunction } from 'rc-use-hook/utils';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';

let originalOverflow: string | null = null;

const useLockScroll = (
  lock = false,
  target: MutableRefObject<HTMLElement | null> | (() => Element) = () =>
    document.body,
): [boolean, (bool: boolean) => void] => {
  const [locked, setLocked] = useState<boolean>(lock);

  const lockFn = useCallback((dom) => {
    originalOverflow = window.getComputedStyle(dom).overflow;
    dom.style.overflow = 'hidden';
  }, []);

  const unlockFn = useCallback((dom) => {
    dom.style.overflow = originalOverflow as string;
    originalOverflow = null;
  }, []);

  useEffect(() => {
    const dom: Element = isFunction(target) ? target?.() : target?.current;
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
