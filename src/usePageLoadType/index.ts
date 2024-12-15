import { useEffect } from 'react';

export enum PageLoadEnum {
  BACK_FORWAR = 'back_forward',
  NAVIGATE = 'navigate',
  RELOAD = 'reload',
}

/**
 * 用于在页面加载时获取页面加载类型
 *
 * @param cb 回调函数，用于处理页面加载类型。参数为 PageLoadEnum 枚举类型，表示页面加载类型。
 */
export default function usePageLoadType(cb: (type: PageLoadEnum) => void) {
  useEffect(() => {
    const entries = performance.getEntriesByType('navigation');
    entries.forEach((entry) => {
      //@ts-ignore
      const type = entry.type as PageLoadEnum;
      cb?.(type as PageLoadEnum);
    });
  }, []);
}
