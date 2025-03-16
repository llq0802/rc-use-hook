---
title: useMergedRef
toc: content
---

# useMergedRef

使用useMergedRef来合并多个refs，并返回一个RefCallback函数

这个函数可以将一个元素同时赋值给多个refs，便于在不同地方访问和操作同一个DOM元素

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

```ts
import { useMergedRef } from 'rc-use-hooks';
const input1Ref = useRef<HTMLInputElement>(null!);
const input2Ref = useRef<HTMLInputElement>(null!);
// 合并两个或多个 ref
const mergedRef = useMergedRef(input1Ref, input2Ref);
```
