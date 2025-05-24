import { useDebounceFn, useEventListener } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useLayoutEffect } from 'react';

function useScale(
  target: Parameters<typeof getTargetElement>[0],
  opt?: {
    clientWidth?: number;
    clientHeight?: number;
    designWidth?: number;
    designHeight?: number;
    wait?: number;
    transition?: string;
  },
) {
  const fn = () => {
    const dom = getTargetElement(target!);
    if (!dom) return;
    const designWidth = opt?.designWidth || 1920;
    const designHeight = opt?.designHeight || 1080;
    const width = opt?.clientWidth || window.innerWidth;
    const height = opt?.clientHeight || window.innerHeight;
    const scale = Math.min(width / designWidth, height / designHeight);
    dom.style.transformOrigin = '0 0';
    dom.style.transition = opt?.transition || 'transform 0.5s';
    const left = (width - designWidth * scale) / 2;
    const top = (height - designHeight * scale) / 2;
    dom.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
  };

  const { run } = useDebounceFn(fn, {
    wait: opt?.wait ?? 0,
  });

  useEventListener('resize', () => {
    run();
  });

  useLayoutEffect(() => {
    fn();
  }, []);
}

export default useScale;
