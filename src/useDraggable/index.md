---
title: useDraggable
toc: content
nav:
  path: /
---

# useDraggable

高性能的可拖动组件的钩子函数

支持 `PC端` `移动端`和`触控笔设备`。

## 代码演示

### 基础用法

默认限制在视口内的拖拽

<code src='./demos/Demo1.tsx'></code>

### 限制在父级元素

<code src='./demos/Demo2.tsx'></code>

### 初始位置

<code src='./demos/Demo3.tsx'></code>

## API

```ts
import { useDraggable } from 'rc-use-hooks';
```

### Params

| 参数    | 说明      | 类型                                                           | 默认值 |
| ------- | --------- | -------------------------------------------------------------- | ------ |
| ele     | ref或元素 | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` | `-`    |
| options | 配置项    | `UseDraggableOptions`                                          | `-`    |

### Result

| 参数 | 说明     | 类型                 | 默认值 |
| ---- | -------- | -------------------- | ------ |
| ret  | 返回对象 | `UseDraggableReturn` | `-`    |

### 类型定义

```ts
export type Position = {
  x: number;
  y: number;
};

export type UseDraggableOptions = {
  /**
   * 拖动元素的默认位置。
   * 如果未提供，则默认为 { x: 0, y: 0 }。
   */
  defaultPosition?: Position;

  /**
   * 拖动元素的边界限制。
   * 可以是 'viewport'（视口）、'parent'（父元素）或自定义的 HTMLElement。
   */
  bounding?: 'viewport' | 'parent' | HTMLElement;

  /**
   * 拖动开始时的回调函数。
   * 在拖动开始时触发，接收当前的位置和 PointerEvent 对象。
   */
  onStart?: (position: Position, e: PointerEvent) => void;

  /**
   * 拖动过程中移动时的回调函数。
   * 在每次移动时触发，接收当前的位置和 PointerEvent 对象。
   */
  onMove?: (position: Position, e: PointerEvent) => void;

  /**
   * 拖动结束时的回调函数。
   * 在拖动结束时触发，接收最终的位置和 PointerEvent 对象。
   */
  onEnd?: (position: Position, e: PointerEvent) => void;
};

type UseDraggableReturn = Position & {
  /**是否正在移动 */
  moving: boolean;
};
```
