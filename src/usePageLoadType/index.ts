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
    if (!window.performance || !window.performance.getEntriesByType) {
      console.warn('Performance API not supported');
      return;
    }

    const entries = performance.getEntriesByType('navigation');
    if (entries.length === 0) {
      console.warn('No navigation entries found');
      return;
    }

    const entry = entries[0];
    if (
      entry &&
      typeof entry.type === 'string' &&
      Object.values(PageLoadEnum).includes(entry.type as PageLoadEnum)
    ) {
      const type = entry.type as PageLoadEnum;
      if (typeof cb === 'function') {
        cb(type);
      }
    } else {
      console.warn('Invalid or unsupported navigation type');
    }
  }, [cb]);
}
