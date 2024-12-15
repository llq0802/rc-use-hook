import { useMount } from 'ahooks';

export default function usePageLoadType() {
  useMount(() => {
    // 判断浏览器是否刷新
    const entries = performance.getEntriesByType('navigation');
    entries.forEach((entry) => {
      if (entry.type === 'reload') {
      }
    });
  });
}
