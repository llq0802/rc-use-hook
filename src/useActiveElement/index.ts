import { useEventListener, useMount } from 'ahooks';
import { useCallback, useState } from 'react';
/**
 * 跟踪当前活跃的元素  `document.activeElement`
 *
 * @template T 继承自 HTMLElement 的类型，用于指定返回的活跃元素的类型
 * @returns 返回当前活跃的元素，如果类型不匹配则返回null
 */
const useActiveElement = <T extends HTMLElement>(): T | null => {
  const [active, setActive] = useState<T | null>(null);

  const listener = useCallback(() => {
    setActive(window?.document.activeElement as T);
  }, []);

  useEventListener('blur', listener, {
    capture: true,
  });

  useEventListener('focus', listener, {
    capture: true,
  });

  useMount(() => {
    setActive(window?.document.activeElement as T);
  });

  return active;
};

export default useActiveElement;
