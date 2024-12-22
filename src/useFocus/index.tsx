import { getTargetElement } from 'rc-use-hooks/utils';
import { useEffect, useState } from 'react';

/**
 * 判断元素输入是否聚焦
 * @param {string} target - 元素
 * @param {boolean} defaultState - 初始值
 * @returns 是否聚焦的状态
 */
const useFocus = (
  target?: Parameters<typeof getTargetElement>[0],
  defaultState = false,
) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const dom = getTargetElement(target) || window;

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
