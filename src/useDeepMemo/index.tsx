import { depsEqual } from 'rc-use-hooks/utils';
import type { DependencyList } from 'react';
import { useRef } from 'react';

/**
 * useDeepMemo 用法等同于 useMemo，会深度比较依赖项的值，如果深度比较后的值一样，则会返回用一个引用地址。
 * @param {() => T} fn 执行函数返回的值
 * @param {DependencyList} deps 依赖项
 * @return {*} 对于引用类型深度比较后的值一样，则会返回用一个引用地址, 反之是新的引用地址
 */
export default function useDeepMemo<T>(factory: () => T, deps: DependencyList) {
  const { current } = useRef({
    deps,
    val: void 0 as undefined | T,
    initialized: false,
  });
  if (current.initialized === false || !depsEqual(current.deps, deps)) {
    current.deps = deps;
    current.val = factory();
    current.initialized = true;
  }
  return current.val as T;
}
