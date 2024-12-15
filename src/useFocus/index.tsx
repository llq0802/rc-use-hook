import { isFunction } from 'rc-use-hooks/utils';
import { MutableRefObject, useEffect, useState } from 'react';

/**
 * 判断输入组件是否聚焦
 * @param {string} target - 元素
 * @param {boolean} defaultState - 初始值
 * @returns 是否聚焦的状态
 */
const useFocus = (
  target: MutableRefObject<HTMLElement | null> | (() => HTMLElement),
  defaultState = false,
) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const dom: HTMLElement = isFunction(target)
      ? (target as () => HTMLElement)?.()
      : (target as MutableRefObject<HTMLElement>)?.current;

    const onFocus = () => setState(true);
    const onBlur = () => setState(false);

    dom.addEventListener('focus', onFocus);
    dom.addEventListener('blur', onBlur);

    return () => {
      dom.removeEventListener('focus', onFocus);
      dom.removeEventListener('blur', onBlur);
    };
  }, []);

  return state;
};

export default useFocus;
