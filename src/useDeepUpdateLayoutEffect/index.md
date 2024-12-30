---
title: useDeepUpdateLayoutEffect
toc: content
---

# useDeepUpdateLayoutEffect

`useDeepUpdateLayoutEffect` 用法等同于 `useLayoutEffect`

会忽略首次执行，只在依赖更新时并且`深度`比较依赖项后执行

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

```ts
import { useDeepUpdateLayoutEffect } from 'rc-use-hooks';
```

API 与 `React.useLayoutEffect` 完全一致。

```ts
useDeepUpdateEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList, // deps依赖项必须传
)
```
