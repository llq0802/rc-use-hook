import { useRef } from 'react';
/**
 *在组件 **将要挂载** 时触发
 * @param fn 回调函数
 */
export function useWillMount(fn: () => void) {
  const flag = useRef(true);
  if (flag.current) {
    flag.current = false;
    try {
      fn();
    } catch (error) {
      console.error(error);
    }
  }
}
