---
title: useRequestAnimationFrame
toc: content
---

# useRequestAnimationFrame

运行一个函数，在每次`重绘`之前调用它。

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

> - 不要在回调函数中执行大量耗时任务 , 否则会阻塞 UI 的渲染

```ts
import { useLazyLoadImage } from 'rc-use-hooks';
useRequestAnimationFrame((deltaTime) => {});
```

### Params

|   参数   |   说明   |             类型              |
| :------: | :------: | :---------------------------: |
| callback | 回调函数 | `(deltaTime: number) => void` |
