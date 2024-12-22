import { isFunction } from 'rc-use-hooks/utils';
import { SetStateAction, useEffect, useState } from 'react';

/**
 * 延迟创建状态，直到满足某些条件。
 * @param initialState 初始的state
 * @param condition 是否满足穿创建初始值的条件
 */
const useDelayedState = <T = any>(
  initialState: T,
  condition: boolean,
): [T | undefined, (newState: T | SetStateAction<T>) => void] => {
  const [{ state, loaded }, setState] = useState<{
    state: T | undefined;
    loaded: boolean;
  }>({
    state: undefined, // 使用 undefined 作为初始值
    loaded: false,
  });

  useEffect(() => {
    if (!loaded && condition) {
      setState({ state: initialState, loaded: true });
    }
  }, [condition, loaded]);

  const updateState = (newState: T | SetStateAction<T>) => {
    if (!loaded) return;
    if (isFunction(newState)) {
      setState((prev) => ({
        //@ts-ignore
        state: typeof newState === 'function' ? newState(prev.state) : newState,
        loaded: true,
      }));
    } else {
      setState({ state: newState, loaded });
    }
  };

  return [state, updateState];
};

export default useDelayedState;
