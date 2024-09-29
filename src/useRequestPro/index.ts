import { useRequest } from 'ahooks';
import type { Options } from 'ahooks/lib/useRequest/src/types';
import { useRef, useState } from 'react';

type UseRequestProArgs = Parameters<typeof useRequest>;

export type UseRequestProOptions<T = any, U extends any[] = any[]> = Options<T, U> & {
  onInitSuccess?: (...args: any[]) => void;
  onNoInitSuccess?: (...args: any[]) => void;
};

/**
 * 与 ahooks 的 useRequest 用法完全一致
 * - 增加第一次请求的 `initLoading` `noInitLoading` 与  `onInitSuccess` `onNoInitSuccess`回调
 *   - loading 全过程都会变 , initLoading只在初始化请求,  noInitLoading只在不是初始化请求
 * - 用于初次请求时的骨架屏效果, 建议配合 <ASkeleton rows={4}/> 组件简化代码
 * @example
 * const { initLoading, loading } = useRequestPro(...args)
 * if(initLoading) return 骨架屏效果
 * if(loading) return Spin效果
 * ...其他业务代码
 */
export function useRequestPro(
  service: UseRequestProArgs[0],
  opts: UseRequestProOptions = {},
  plugins?: UseRequestProArgs[2],
) {
  const isInitRef = useRef(true);
  const [initLoading, setInitLoading] = useState(true);
  const ret = useRequest(
    service,
    {
      ...opts,
      onSuccess(...p) {
        opts?.onSuccess?.(...p);
        if (isInitRef.current) {
          opts?.onInitSuccess?.(...p);
          setInitLoading(false);
          isInitRef.current = false;
        } else {
          opts?.onNoInitSuccess?.(...p);
        }
      },
      onError(...p) {
        if (initLoading) setInitLoading(false);
        opts?.onError?.(...p);
      },
    },
    plugins,
  );
  const noInitLoading = !initLoading && ret?.loading;
  return {
    ...ret,
    initLoading,
    noInitLoading,
    isInitRef,
  };
}
