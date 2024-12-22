import { useRef } from 'react';
/**
 *在组件 **将要挂载** 时触发 只会触发一次
 *
 *此时 dom 还没有挂载，所以不能使用 dom
 * @param fn 回调函数
 */
export default function useWillMount(fn: () => void) {
  const flag = useRef(true);
  if (flag.current) {
    flag.current = false;
    try {
      fn?.();
    } catch (error) {
      console.error(error);
    }
  }
}
