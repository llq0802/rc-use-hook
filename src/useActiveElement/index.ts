import { useEventListener, useMount } from 'ahooks';
import { useCallback, useState } from 'react';
/**
 * 使用 useActiveElement 钩子来跟踪当前活跃的元素
 *
 * @template T 继承自Element的类型，用于指定返回的活跃元素的类型
 * @returns 返回当前活跃的元素，如果类型不匹配则返回null
 */
export const useActiveElement = <T extends HTMLElement>(): T | null => {
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
