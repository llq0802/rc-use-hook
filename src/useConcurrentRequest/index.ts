import { useCallback, useEffect, useRef, useState } from 'react';

type AsyncFnsType = ((...args: any[]) => Promise<any>[])[];

/**
 * 并发请求函数
 * @param {*} asyncFns 异步请求函数数组
 * @param {*} max
 */
export default function useConcurrentRequest(
  asyncFns: AsyncFnsType,
  options = {},
) {
  const { max, autoRequest } = {
    max: 3,
    autoRequest: true,
    onSuccess,
    onError,
    ...options,
  };

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any[]>();
  const timer = useRef<NodeJS.Timeout>();

  const run = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (asyncFns?.length === 0) {
        resolve([]);
        return;
      }
      const result: any[] = [];
      let index = 0, // 获取当前异步函数的索引
        count = 0; // 已经请求得次数

      async function _request() {
        if (index === asyncFns?.length) return;

        const i = index,
          curFn = asyncFns[index];
        index++;

        try {
          timer.current = setTimeout(() => setLoading(true), 200);
          const ret = await curFn(index);
          result[i] = ret;
        } catch (err) {
          result[i] = err;
          reject(err);
          setData(void 0);
        } finally {
          count++;
          if (count === asyncFns.length) {
            if (timer.current) {
              clearTimeout(timer.current);
            }
            setLoading(false);
            setData(result);
            resolve(result);
          }
          _request();
        }
      }

      const num = Math.min(max, asyncFns?.length || 0);
      // 在循环中几乎可以认为是同时并发请求
      for (let s = 0; s < num; s++) {
        _request();
      }
    });
  }, []);

  useEffect(() => {
    if (autoRequest) {
      run();
    }
  }, []);

  return {
    run,
    loading,
    data,
    setData,
  };
}
