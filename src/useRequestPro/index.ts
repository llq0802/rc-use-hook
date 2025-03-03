import { useLockFn, usePrevious, useRafState, useRequest } from 'ahooks';
import type { Options } from 'ahooks/lib/useRequest/src/types';
import { isPlainObject } from 'lodash-es';
import { isFunction } from 'rc-use-hooks/utils';
import { useMemo, useRef } from 'react';

/**
 * 请求函数类型定义
 *
 * @template TData - 请求返回的数据类型，默认为 `any`
 * @template TParams - 请求参数类型，默认为 `any[]`
 */
export type ServicePro<TData = any, TParams extends any[] = any[]> = (
  ...args: TParams
) => Promise<TData>;

/**
 * `useRequestPro` 的配置项类型定义
 *
 * @template TData - 请求返回的数据类型，默认为 `any`
 * @template TParams - 请求参数类型，默认为 `any[]`
 */
export type OptionsPro<TData, TParams extends any[]> = {
  /**
   * 指定结果数据的键名，默认为整个响应对象
   *
   * - 必须满足 ServicePro 异步函数的返回值是一个普通`object`类型
   *
   * - 如果配置了`formatResult` 则以 `formatResult` 的返回值作为响应结果
   */
  dataKeyName?: string;

  /**
   * 是否启用 `run` 或者 `runAsync` 函数增加竞态锁，防止并发执行。
   */
  isLockRun?: boolean;

  /**
   * 格式化请求结果的函数
   *
   * 优先级比 `dataKeyName` 高
   * @param result - 请求返回的结果
   * @param params - 请求参数
   * @returns 格式化后的结果
   */
  formatResult?: (result: TData, params: TParams) => any;

  /**
   * 初始请求成功的回调函数
   * @param ret - 请求返回的结果
   * @param params - 请求参数
   */
  onInitSuccess?: (ret: TData, params: TParams) => void;

  /**
   * 非初始请求成功的回调函数
   * @param ret - 请求返回的结果
   * @param params - 请求参数
   */
  onNoInitSuccess?: (ret: TData, params: TParams) => void;
  /**自定义判断数据是否为空, 函数的返回值会作为 hasData 的值 */
  hasDataFn?: (data: TData | undefined, params: TParams) => boolean;
} & Options<TData, TParams>;

/**
 * `useRequestPro` 返回的结果类型定义
 *
 * @template TData - 请求返回的数据类型，默认为 `any`
 */
export type UseRequestProReturn<TData> = ReturnType<typeof useRequest> & {
  /**
   * 上一次请求的数据
   */
  previousData: TData | undefined;

  /**
   * 初始请求*`成功`*的数据
   */
  initData: TData | undefined;

  /**
   * 初始加载状态
   */
  initLoading: boolean;

  /**
   * 非初始加载状态
   */
  noInitLoading: boolean;
  /**
   * 是否含有数据
   * 
   * 如果配置了 hasDataFn 函数，则使用自定义函数的返回值
   * 
   * 默认情况时 以下的返回值的判断规则为：
 
   *  - `false`  `''`  `null`  `undefined`  `NaN`  为空数据
   *  - 如果是数组类型，则判断其长度是否大于 `0`
   *  - 如果是普通的 `object` 类型，则判断其是否为空对象 `{}`
   *  - 其余的任意类型的值都为`true`
   * 
   */
  hasData: boolean;
};

/**
 * `useRequestPro` 是对 `ahooks` 库中 `useRequest` 的二次封装，
 *
 * 旨在简化其使用并提供额外的功能。它允许开发者更方便地处理请求、格式化结果、设置初始加载状态等。
 *
 * @template TData - 请求返回的数据类型，默认为 `any`
 * @template TParams - 请求参数类型，默认为 `any[]`
 * @param fn - 请求函数，类型为 `ServicePro`，接收两个泛型参数 `TData` 和 `TParams`，分别表示返回数据类型和参数类型
 * @param opts - 请求选项，类型为 `OptionsPro`，包含请求的各种配置，默认值为空对象
 * @returns 返回请求的结果，以及初始数据、初始加载状态和是否未初始化加载状态
 */
export default function useRequestPro<
  TData = any,
  TParams extends any[] = any[],
>(
  fn: ServicePro<TData, TParams>,
  opts: OptionsPro<TData, TParams> = {},
): UseRequestProReturn<TData> {
  const isFirstRequestRef = useRef(true);
  const [initData, setInitData] = useRafState<TData | undefined>();
  const [initLoading, setInitLoading] = useRafState(false);
  const [noInitLoading, setNoInitLoading] = useRafState(false);
  const {
    isLockRun,
    dataKeyName,
    formatResult,
    onInitSuccess,
    onNoInitSuccess,
    //
    cacheKey,
    getCache,
    setCache,
    ...rest
  } = opts;

  const getCacheFn = (...args) => {
    if (!cacheKey) return;
    if (getCache) return getCache(...args);
    return JSON.parse(localStorage.getItem(cacheKey) || '{}');
  };
  const setCacheFn = (data: any) => {
    if (!cacheKey) return;
    if (setCache) return setCache(data);
    localStorage.setItem(cacheKey, JSON.stringify(data));
  };

  const res = useRequest<TData, TParams>(
    async (...pars) => {
      const result = await fn(...pars);
      if (formatResult) {
        return formatResult(result, pars);
      }
      if (dataKeyName && isPlainObject(result)) {
        //@ts-expect-error ignore
        return result?.[dataKeyName];
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
      cacheKey,
      setCache: setCacheFn,
      getCache: getCacheFn,
    },
  );

  const previousData = usePrevious(res?.data);
  const lockRun = useLockFn(async (...args: Parameters<typeof res.run>) =>
    res.run(...args),
  );
  const lockRunAsync = useLockFn(res.runAsync);
  const run = isLockRun ? lockRun : res.run;
  const runAsync = isLockRun ? lockRunAsync : res.runAsync;

  const hasData = useMemo(() => {
    if (isFunction(opts.hasDataFn))
      return opts.hasDataFn(res.data, res.params as TParams);

    if (Array.isArray(res.data)) {
      return res.data.length > 0;
    }
    if (res.data && isPlainObject(res.data)) {
      return Object.keys(res?.data).length > 0;
    }
    if (res.data !== 0 && !res.data) {
      return false;
    }
    return true;
  }, [res.data, res.params]);

  return {
    ...res,
    run,
    runAsync,
    previousData,
    hasData,
    initData,
    initLoading,
    noInitLoading,
  };
}
