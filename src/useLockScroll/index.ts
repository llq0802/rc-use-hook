import { isFunction } from 'rc-use-hook/utils';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';

let originalOverflow: string | null = null;

const useLockScroll = (
  lock = false,
  target: MutableRefObject<HTMLElement | null> | (() => Element) = () =>
    document.body,
): [boolean, (bool: boolean) => void] => {
  const [locked, setLocked] = useState<boolean>(lock);

  const dom: Element = isFunction(target) ? target?.() : target?.current;

  const lockFn = useCallback(() => {
    originalOverflow = window.getComputedStyle(dom).overflow;
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockFn = useCallback(() => {
    document.body.style.overflow = originalOverflow as string;
    originalOverflow = null;
  }, []);

  useEffect(() => {
    if (locked) {
      lockFn();
    } else {
      unlockFn();
    }
  }, [locked]);

  useEffect(() => {
    return () => setLocked(lock);
  }, []);

  const set = useCallback((bool: boolean) => setLocked(bool), []);

  return [locked, set];
};

export default useLockScroll;
