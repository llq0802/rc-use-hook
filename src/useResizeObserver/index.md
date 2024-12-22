---
title: useResizeObserver
toc: content
---

# useResizeObserver

用于观察指定元素的尺寸变化并调用回调函数

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

```ts
import { useResizeObserver } from 'rc-use-hooks';

const useResizeObserver: (
  target: MutableRefObject<HTMLElement | null> | (() => HTMLElement),
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions,
) => stopFunction;
```
