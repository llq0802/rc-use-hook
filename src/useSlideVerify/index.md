---
title: useSlideVerify
toc: content
---

# useSlideVerify

用于滑块验证滑动距离的hook

支持PC端 移动端 以及触摸笔

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

```ts
import { useSlideVerify } from 'rc-use-hooks';

const {moveX,reset} =useSlideVerify(
  el: (() => HTMLElement) | React.RefObject<HTMLElement>,
  {
    maxMoveX = 400,
    onMouseUp= (x) => {},
  }: { maxMoveX?: number; onMouseUp?: (moveX: number) => void } = {},
);
```
