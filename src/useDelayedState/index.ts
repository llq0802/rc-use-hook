import { isFunction } from 'rc-use-hooks/utils';
import { SetStateAction, useEffect, useState } from 'react';

/**
 * 延迟创建状态，直到满足某些条件。
 * @param initialState
 * @param condition
 * @return
 */
const useDelayedState = <T = any>(
  initialState: T,
  condition: boolean,
): [T, (newState: T) => void] => {
  const [{ state, loaded }, setState] = useState<{
    state: T;
    loaded: boolean;
  }>({
    state: void 0,
    loaded: false,
  });

  useEffect(() => {
    if (!loaded && condition) {
      setState({ state: initialState as unknown, loaded: true });
    }
  }, [condition, loaded]);

  const updateState = (newState: T | SetStateAction<T>) => {
    if (!loaded) return;

    if (isFunction(newState)) {
      setState((prev) => {
        return {
          state: newState?.(prev.state),
          loaded: true,
        };
      });
    } else {
      setState({ state: newState, loaded });
    }
  };

  return [state, updateState];
};

export default useDelayedState;
