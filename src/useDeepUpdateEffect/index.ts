import { depsEqual } from 'rc-use-hooks/utils';
import {
  useEffect,
  useRef,
  type DependencyList,
  type EffectCallback,
} from 'react';

// /**
//  * 是否时第一次渲染组件
//  */
// const useIsFirstRender = (deps): boolean => {
//   // const isFirst = useRef<boolean>(true);
//   // const { current } = isFirst;
//   // // 如果是第一次，改变状态并返回true
//   // if (current) {
//   //   isFirst.current = false;
//   //   return true;
//   // }
//   // return current;
//   const isFirstMount = useRef(true);
//   useEffect(() => {
//     isFirstMount.current = false;
//   }, [deps]);
//   return isFirstMount.current;
// };

/**
 * 只在更新时调用并且会深度比较依赖项
 * @param effect{EffectCallback} 更新时所需要调用的函数
 * @param deps{DependencyList}  更新的依赖 (深度比较依赖项)
 */
const useDeepUpdateEffect = (
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

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, [countRef.current]);
};
export default useDeepUpdateEffect;
