import { useDebounceFn, useEventListener } from 'ahooks';
import { getTargetElement } from 'rc-use-hooks/utils';
import { useLayoutEffect } from 'react';

function useScale(
  target?: Parameters<typeof getTargetElement>[0],
  opt?: {
    designWidth?: number;
    designHeight?: number;
    wait?: number;
    transition?: string;
  },
) {
  const { run, flush } = useDebounceFn(
    () => {
      const dom = getTargetElement(target!);
      if (!dom) return;
      const designWidth = opt?.designWidth || 1920;
      const designHeight = opt?.designHeight || 1080;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.min(width / designWidth, height / designHeight);
      dom.style.transformOrigin = '0 0';
      dom.style.transition = opt?.transition || 'transform 0.5s';
      const left = (width - designWidth * scale) / 2;
      const top = (height - designHeight * scale) / 2;
      dom.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
    },
    {
      wait: opt?.wait ?? 500,
    },
  );

  useEventListener('resize', () => {
    run();
  });

  useLayoutEffect(() => {
    flush();
  }, []);
}

export default useScale;
