// import { useCallback, useEffect, useRef, useState } from 'react';
// type AsyncFnsType = ((...args: any[]) => Promise<any>[])[];
// /**
//  * 并发请求函数
//  * @param {*} asyncFns 异步请求函数数组
//  * @param {*} max
//  */
// export default function useConcurrentRequest(
//   asyncFns: AsyncFnsType,
//   options = {},
// ) {
//   const { max, autoRequest } = {
//     max: 3,
//     autoRequest: true,
//     onSuccess,
//     onError,
//     ...options,
//   };

//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any[]>();
//   const timer = useRef<NodeJS.Timeout>();

//   const run = useCallback(() => {
//     return new Promise((resolve, reject) => {
//       if (asyncFns?.length === 0) {
//         resolve([]);
//         return;
//       }
//       const result: any[] = [];
//       let index = 0, // 获取当前异步函数的索引
//         count = 0; // 已经请求得次数

//       async function _request() {
//         if (index === asyncFns?.length) return;

//         const i = index,
//           curFn = asyncFns[index];
//         index++;

//         try {
//           timer.current = setTimeout(() => setLoading(true), 200);
//           const ret = await curFn(index);
//           result[i] = ret;
//         } catch (err) {
//           result[i] = err;
//           reject(err);
//           setData(void 0);
//         } finally {
//           count++;
//           if (count === asyncFns.length) {
//             if (timer.current) {
//               clearTimeout(timer.current);
//             }
//             setLoading(false);
//             setData(result);
//             resolve(result);
//           }
//           _request();
//         }
//       }

//       const num = Math.min(max, asyncFns?.length || 0);
//       // 在循环中几乎可以认为是同时并发请求
//       for (let s = 0; s < num; s++) {
//         _request();
//       }
//     });
//   }, []);

//   useEffect(() => {
//     if (autoRequest) {
//       run();
//     }
//   }, []);

//   return {
//     run,
//     loading,
//     data,
//     setData,
//   };
// }

import { useRequest } from 'ahooks';
import { Options, Service } from 'ahooks/lib/useRequest/src/types';

export interface AllRequestOptions
  extends Omit<Options<any, any[]>, 'defaultParams'> {
  /**最大并发请求数量 */
  max?: number;
  /**是否与 Promise.allSettled 效果一样 */
  allSettled?: boolean;
  /**默认参数 在自动请求的时候会带上 */
  defaultParams?: any[][];
}

/**
 * 对 ahooks 的 useRequest 实现的异步并发请求函数,
 * @param {Service<any, any[]>[]} [asyncFns=[]] 异步请求函数数组
 * @param {AllRequestOptions} [options={}] ahooks 的 useRequest 的配置项 增加了 max 与 allSettled
 * @return {*} ahooks 的 useRequest 的返回值
 */
export default function useAllRequest(
  asyncFns: Service<any, any[]>[] = [],
  options: AllRequestOptions = {},
) {
  const {
    max = asyncFns?.length || 3,
    allSettled = true,
    ...requestOpt
  } = options;

  async function runRequest(...args: any[]) {
    // const funList = asyncFns.map((fun, i) => fun(i));
    // return Promise.allSettled(funList);
    return new Promise((resolve, reject) => {
      if (!asyncFns?.length) {
        resolve([]);
        return;
      }

      const result: any[] = [];
      let index = 0, // 获取当前异步函数的索引
        count = 0; // 已经请求得次数

      async function _request() {
        if (index === asyncFns?.length) return;
        const curFn = asyncFns[index];

        const i = index;

        const curFnParams = args?.[i] ?? [];

        index++;

        try {
          const ret = await curFn(...curFnParams);
          result[i] = ret;
        } catch (err) {
          // 会到useRequest的onError中
          result[i] = err;
          // 只要有一项异步函数被拒绝则不返回数据
          if (!allSettled) {
            reject(err);
          }
        } finally {
          count++;
          // 最后完成并发
          if (count === asyncFns.length) {
            resolve(result);
            if (!allSettled) {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              res?.mutate(void 0);
            }
          }
          _request();
        }
      }
      // 判断最大并发数
      const num = Math.min(max, asyncFns?.length);
      // 在循环中几乎可以认为是同时并发请求
      for (let s = 0; s < num; s++) {
        _request();
      }
    });
  }
  const res = useRequest(runRequest, { ...requestOpt });

  return res;
}
