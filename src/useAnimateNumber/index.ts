import { useMemoizedFn } from 'ahooks';
import useNumber from 'use-animate-number';

type UseAnimateNumberOptions = {
  duration?: number;
  enterance?: boolean;
  direct?: boolean;
  disabled?: boolean;
  decimals?: number;
};
/**
 * 使用数字动画的自定义钩子.
 *
 * @param state 初始数值状态，默认为0.
 * @param UseAnimateNumberOptions 动画的配置选项.
 * @returns 返回一个包含当前数值和更新数值函数的数组.
 */
export default function useAnimateNumber<T = number>(
  state = 0,
  options: UseAnimateNumberOptions = {},
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
