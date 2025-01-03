import { useCallback } from 'react';

/**
 * 使用useMergedRef来合并多个refs，并返回一个RefCallback函数
 * 这个函数可以将一个元素同时赋值给多个refs，便于在不同地方访问和操作同一个DOM元素
 *
 * @param refs 需要合并的refs数组，可以是函数类型的ref、对象类型的ref或者null
 * @returns 返回一个RefCallback函数，用于将元素赋值给所有传入的refs
 */
function useMergedRef<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useCallback(
    (element: T) => {
      for (let i = 0; i < refs.length; i++) {
        const ref = refs[i];
        if (typeof ref === 'function') ref(element);
        else if (ref && typeof ref === 'object')
          (ref as React.MutableRefObject<T>).current = element;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}

export default useMergedRef;
