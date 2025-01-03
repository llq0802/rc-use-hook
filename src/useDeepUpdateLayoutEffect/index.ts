import { depsEqual } from 'rc-use-hooks/utils';
import {
  useLayoutEffect,
  useRef,
  type DependencyList,
  type EffectCallback,
} from 'react';

/**
 * 只在更新时调用并且会深度比较依赖项
 * @param effect{EffectCallback} 更新时所需要调用的函数
 * @param deps{DependencyList}  更新的依赖 (深度比较依赖项)
 */
const useDeepUpdateLayoutEffect = (
  effect: EffectCallback,
  deps: DependencyList,
): void => {
  const isMounted = useRef(false);
  const countRef = useRef(0);
  const depsRef = useRef<DependencyList>();

  if (deps === void 0 || !depsEqual(deps, depsRef.current)) {
    countRef.current += 1;
    depsRef.current = deps;
  }

  useLayoutEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, [countRef.current]);
};
export default useDeepUpdateLayoutEffect;
