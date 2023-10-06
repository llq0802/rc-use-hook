import { useMemoizedFn } from 'ahooks';
import useNumber from 'use-animate-number';

type Options = {
  duration?: number;
  enterance?: boolean;
  direct?: boolean;
  disabled?: boolean;
  decimals?: number;
};

export default function useAnimateNumber<T = number>(
  state = 0,
  options: Options = {},
): [val: number, fn: (patch: T | ((num: T) => T), skip?: boolean) => void] {
  const [value, setValue] = useNumber(state, {
    duration: 1000,
    enterance: true,
    direct: false,
    disabled: false,
    decimals: 2,
    ...options,
  });

  const setState = useMemoizedFn((patch: T | ((num: T) => T), skip = false) => {
    if (typeof patch === 'number') {
      setValue(patch, skip);
    } else if (typeof patch === 'function') {
      //@ts-ignore
      setValue(patch?.(), skip);
    }
  });

  return [value, setState];
}
