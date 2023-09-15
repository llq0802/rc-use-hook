---
title: useDeepMemo
toc: content
---

# useDeepMemo

`useDeepMemo` 用法等同于 `React.useMemo`，
会`深度`比较依赖项的值，如果`深度`比较后的值一样，则会返回用一个引用地址。

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useDeepMemo } from 'rc-use-hooks';
```

API 与 `React.useMemo` 完全一致。
