---
title: useRequestPro
toc: content
---

# useRequestPro

`useRequestPro` 是对 `ahooks` 库中 `useRequest` 的二次封装，

旨在简化其使用并提供额外的功能。它允许开发者更方便地处理请求、格式化结果、设置初始加载状态等。

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useRequestPro } from 'rc-use-hooks';
```

[useRequest文档](https://ahooks.js.org/zh-CN/hooks/use-request/basic)

> useRequestPro 的参数完全继承 `useRequest` 的配置项进行封装，并添加了额外的功能。

第二个参数多了以下配置

- dataKeyName?: string;
- isLockRun?: boolean;
- formatResult?: (result: TData, params: TParams) => any;
- onInitSuccess?: (ret: TData, params: TParams) => void;
- onNoInitSuccess?: (ret: TData, params: TParams) => void;

> useRequestPro 的返回值继承照 `useRequest` 的返回值，并添加了额外的返回值。

返回值多了以下值

- previousData: TData | undefined;
- initData: TData | undefined;
- initLoading: boolean;
- noInitLoading: boolean;

## 类型定义

```ts
/**
 * 请求函数类型定义
 *
 * @template TData - 请求返回的数据类型，默认为 `any`
 * @template TParams - 请求参数类型，默认为 `any[]`
 */
export type ServicePro<TData = any, TParams extends any[] = any[]> = (
  ...args: TParams
) => Promise<TData>;

/**
 * `useRequestPro` 的配置项类型定义
 *
 * @template TData - 请求返回的数据类型，默认为 `any`
 * @template TParams - 请求参数类型，默认为 `any[]`
 */
export type OptionsPro<TData, TParams extends any[]> = {
  /**
   * 指定结果数据的键名，默认为整个响应对象
   *
   * - 必须满足 ServicePro 异步函数的返回值是一个普通`object`类型
   *
   * - 如果配置了`formatResult` 则以 `formatResult` 的返回值作为响应结果
   */
  dataKeyName?: string;

  /**
   * 是否启用 `run` 或者 `runAsync` 函数增加竞态锁，防止并发执行。
   */
  isLockRun?: boolean;

  /**
   * 格式化请求结果的函数
   *
   * 优先级比 `dataKeyName` 高
   * @param result - 请求返回的结果
   * @param params - 请求参数
   * @returns 格式化后的结果
   */
  formatResult?: (result: TData, params: TParams) => any;

  /**
   * 初始请求成功的回调函数
   * @param ret - 请求返回的结果
   * @param params - 请求参数
   */
  onInitSuccess?: (ret: TData, params: TParams) => void;

  /**
   * 非初始请求成功的回调函数
   * @param ret - 请求返回的结果
   * @param params - 请求参数
   */
  onNoInitSuccess?: (ret: TData, params: TParams) => void;
  /**自定义判断数据是否为空, 函数的返回值会作为 hasData 的值 */
  hasDataFn?: (data: TData | undefined, params: TParams) => boolean;
} & Options<TData, TParams>;

/**
 * `useRequestPro` 返回的结果类型定义
 *
 * @template TData - 请求返回的数据类型，默认为 `any`
 */
export type UseRequestProReturn<TData> = ReturnType<typeof useRequest> & {
  /**
   * 上一次请求的数据
   */
  previousData: TData | undefined;

  /**
   * 初始请求*`成功`*的数据
   */
  initData: TData | undefined;

  /**
   * 初始加载状态
   */
  initLoading: boolean;

  /**
   * 非初始加载状态
   */
  noInitLoading: boolean;
  /**
   * 是否含有数据
   *
   * 如果配置了 hasDataFn 函数，则使用自定义函数的返回值
   *
   * 默认情况时 以下的返回值的判断规则为：
   *  - `false`  `''`  `null`  `undefined`  `NaN`  为空数据
   *  - 如果是数组类型，则判断其长度是否大于 `0`
   *  - 如果是普通的 `object` 类型，则判断其是否为空对象 `{}`
   *  - 其余的任意类型的值都为`true`
   *
   */
  hasData: boolean;
};
```
