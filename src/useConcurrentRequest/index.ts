import { useCallback, useEffect, useState } from 'react';

type AsyncFnsType = ((...args: any[]) => Promise<any>[])[];

/**
 * 并发请求函数
 * @param {*} asyncFns
 * @param {*} max
 * @return {*}
 */
export default function useConcurrentRequest(
  asyncFns: AsyncFnsType,
  options = {},
) {
  const { max, autoRequest } = {
    max: 3,
    autoRequest: false,
    ...options,
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>();

  const run = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (asyncFns?.length === 0) {
        resolve([]);
        return;
      }
      const result: any[] = [];
      let index = 0, // 获取当前异步函数的索引
        count = 0; // 已经请求得次数

      async function request() {
        if (index === asyncFns?.length) return;

        const i = index,
          curFn = asyncFns[index];
        index++;

        try {
          setLoading(true);
          const ret = await curFn();
          result[i] = ret;
        } catch (err) {
          result[i] = err;
          reject(err);
        } finally {
          count++;
          if (count === asyncFns.length) {
            setLoading(false);
            setData(result);
            resolve(result);
          }
          request();
        }
      }

      const num = Math.min(max, asyncFns.length);
      for (let s = 0; s < num; s++) {
        request();
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
