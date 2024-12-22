---
title: useDraggable
toc: content
nav:
  path: /
---

# useDraggable

用于平滑动画数字变化的`useState`

## 代码演示

### 基础用法

默认限制在视口内的拖拽

<code src='./demos/Demo1.tsx'></code>

### 限制在父级元素

<code src='./demos/Demo2.tsx'></code>

### 初始位置

<code src='./demos/Demo3.tsx'></code>

### API

```ts
import { useDraggable } from 'rc-use-hooks';
```

### Params

| 参数    | 说明       | 类型      | 默认值 |
| ------- | ---------- | --------- | ------ |
| num     | 初始数字值 | `number`  | `0`    |
| options | 配置项     | `Options` | `-`    |

### Result

| 参数   | 说明                                                      | 类型                                    | 默认值 |
| ------ | --------------------------------------------------------- | --------------------------------------- | ------ |
| val    | 数字值                                                    | `number`                                | `-`    |
| setVal | 更新数字值的函数, `isSkip 为 true 时此次更新不会触发动画` | `(num:number, isSkip?:boolean) => void` | `-`    |

### Options

```ts
interface Options {
  /**
   * 初次组件挂载时是否开启动画 (从0开始加载到初始值) 默认为 true
   */
  enterance?: boolean;
  /**
   * 动画持续时间 默认 1000ms
   */
  duration?: number;
}
```
