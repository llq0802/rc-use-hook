import { useLockFn, usePrevious, useRafState, useRequest } from 'ahooks';
import type { Options } from 'ahooks/lib/useRequest/src/types';
import { isPlainObject } from 'lodash-es';
import { useRef } from 'react';

type ServicePro<TData = any, TParams extends any[] = any[]> = (
  ...args: TParams
) => Promise<TData>;

type OptionsPro<TData, TParams extends any[]> = {
  dataKeyName?: string;
  /**是否启用`run`或者`runAsync`函数增加竞态锁，防止并发执行。 */
  isLockRun?: boolean;
  formatResult?: (result: TData, params: TParams) => any;
  onInitSuccess?: (ret: TData, params: TParams) => void;
  onNoInitSuccess?: (ret: TData, params: TParams) => void;
} & Options<TData, TParams>;

/**
 * 二次封装 useRequest 更加简化 ahooks 的  useRequest
 *
 * @param fn 请求函数，类型为ServicePro，接收两个泛型参数TData和TParams，分别表示返回数据类型和参数类型
 * @param opts 请求选项，类型为OptionsPro，包含请求的各种配置，默认值为空对象
 * @returns 返回请求的结果，以及初始数据、初始加载状态和是否未初始化加载状态
 */
export default function useRequestPro<
  TData = any,
  TParams extends any[] = any[],
>(fn: ServicePro<TData, TParams>, opts: OptionsPro<TData, TParams> = {}) {
  const isFirstRequestRef = useRef(true);
  const [initData, setInitData] = useRafState<TData>();
  const [initLoading, setInitLoading] = useRafState(false);
  const [noInitLoading, setNoInitLoading] = useRafState(false);
  const {
    isLockRun,
    dataKeyName,
    formatResult,
    onInitSuccess,
    onNoInitSuccess,
    ...rest
  } = opts;

  const res = useRequest<TData, TParams>(
    async (...pars) => {
      const result = await fn(...pars);
      if (formatResult) {
        return formatResult(result, pars) ?? result;
      }
      if (dataKeyName && isPlainObject(result)) {
        //@ts-expect-error ignore
        return result[dataKeyName] ?? result;
      }
      return result;
    },
    {
      ...rest,
      onBefore: (...args) => {
        if (isFirstRequestRef.current) {
          if (!initLoading) setInitLoading(true);
        } else {
          if (!noInitLoading) setNoInitLoading(true);
        }
        rest?.onBefore?.(...args);
      },
      onSuccess(ret, params) {
        if (isFirstRequestRef.current) {
          isFirstRequestRef.current = false;
          setInitData(ret);
          if (initLoading) setInitLoading(false);
          onInitSuccess?.(ret, params);
        } else {
          onNoInitSuccess?.(ret, params);
          if (noInitLoading) setNoInitLoading(false);
        }
        rest.onSuccess?.(ret, params);
      },
      onError(err, params) {
        if (initLoading) setInitLoading(false);
        if (noInitLoading) setNoInitLoading(false);
        rest.onError?.(err, params);
      },
    },
  );

  const previousData = usePrevious(res?.data);

  const lockRun = useLockFn(async (...args: Parameters<typeof res.run>) =>
    res.run(...args),
  );
  const lockRunAsync = useLockFn(res.runAsync);

  const run = isLockRun ? lockRun : res.run;
  const runAsync = isLockRun ? lockRunAsync : res.runAsync;

  return {
    ...res,
    run,
    runAsync,
    /**上一次的 data 值  */
    previousData,
    /**第一次请求时的初始数据 */
    initData,
    /**第一次请求时的 loading */
    initLoading,
    /**非第一次请求时的 loading */
    noInitLoading,
  };
}
