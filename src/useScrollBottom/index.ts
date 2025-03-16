import { useRafState } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useEffect } from 'react';

/**
 * 判断是否滚动到底部
 */
const useScrollBottom = (
  target: Parameters<typeof getTargetElement>[0],
  opts?: {
    threshold?: number;
    defaultState?: boolean;
    onBottom?: () => void;
    onNoBottom?: () => void;
  },
) => {
  const {
    threshold = 0,
    defaultState = false,
    onBottom,
    onNoBottom,
  } = opts || {};
  const [isBottom, setIsBottom] = useRafState(defaultState);

  useEffect(() => {
    const dom = getTargetElement(target!) || document;
    const handle = (e) => {
      const container = e.target as HTMLElement;
      if (
        container.clientHeight + container.scrollTop + threshold >=
        container.scrollHeight
      ) {
        setIsBottom(true);
        onBottom?.();
      } else {
        setIsBottom(false);
        onNoBottom?.();
      }
    };
    dom.addEventListener('scroll', handle);
    return () => {
      dom.removeEventListener('scroll', handle);
    };
  }, []);

  return isBottom;
};

export default useScrollBottom;
