import { useMemoizedFn } from 'ahooks';
import { isFunction } from 'rc-use-hooks/utils';
import type { SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * useState 的回调 setState 第二个参数(回调函数)获取最新的`state`并执行一些操作
 * @param {T} state
 * @return {*}  { [T,  (val: SetStateAction<T>, cb: (newVal: T) => void) => void}
 */
export default function useCallbackState<T>(
  initialState: T,
): [T, (val: SetStateAction<T>, cb?: (newVal: T) => void) => void] {
  const callBackRef = useRef<(newData: T) => void>();
  const [data, setData] = useState<T>(initialState);
  useEffect(() => {
    callBackRef?.current?.(data);
  }, [data]);

  const setState = useMemoizedFn(
    (newState: SetStateAction<T>, cb?: (val: T) => void) => {
      if (isFunction(cb)) callBackRef.current = cb;
      setData(newState);
    },
  );

  return [data, setState];
}
