---
title: useConcurrentRequest
toc: content
---

# useConcurrentRequest

并发请求函数

- 支持最大并发数量
- 支持 `Promise.allSettled` 模式
- 完美兼容 `ahooks` 的 `useRequest`

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

### 设置最大并发数量

<code src="./demos/Demo3.tsx" ></code>

### 只要有一项异步函数被拒绝则不返回数据

<code src="./demos/Demo2.tsx" ></code>

## API

> - 继承 `ahooks` 的 `useRequest` 的所有配置项
> - 配置项 `defaultParams` 变为二维数组, 会根据索引将内层展开数组参数传递给 `services`
> - `run()` 或 `runAsync()` 函数的参数列表会根于索引传递给 `services`, 并且每个参数列表只能是数组
> - `allSettled` 为 `false` 时, 并发的请求函数中只要有一项失败`reject()` , 就不会返回数据. 反之都返回,但还是会触发失败事件
> - 设置了最大并发数量后, 如果小于`services`的数量 后续请求会依次串行请求直至全部完成

```ts
import { useConcurrentRequest } from 'rc-use-hooks';
```

### Params

|   参数   |       说明       |                  类型                  | 默认值 |
| :------: | :--------------: | :------------------------------------: | :----: |
| services | 异步请求函数数组 | `((...args: any[]) => Promise<any>)[]` |  `[]`  |
| options  |      配置项      |       `ConcurrentRequestOptions`       |  `-`   |

### Result

与 `ahooks` 的 `useRequest` 返回值完全一致

### ConcurrentRequestOptions

```ts
export interface ConcurrentRequestOptions extends Options<any, any[]> {
  /**最大并发请求数量 */
  max?: number; // 默认为异步请求函数数组的大小
  /**是否与 Promise.allSettled 效果一样  为false时只要有一项异步函数被拒绝则不返回数据 但还是会触发onError事件*/
  allSettled?: boolean; // 默认为 true
  // ....其余与 ahooks 的 useRequest 配置一样
}
```
