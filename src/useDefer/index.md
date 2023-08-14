---
title: useDefer
toc: content
---

# useDefer

分片渲染长列表，用于解决渲染时间过长导致白屏问题

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useDefer } from 'rc-use-hook';
```

### Params

|     参数      |    说明    |   类型   | 默认值  |
| :-----------: | :--------: | :------: | :-----: |
| maxFrameCount | 列表的数量 | `number` | `10_00` |

### Result

|     参数      |          说明          |                  类型                   |
| :-----------: | :--------------------: | :-------------------------------------: |
| isDeferRender | 当前在哪一帧渲染的函数 | `(showInFrameCount: number) => boolean` |
