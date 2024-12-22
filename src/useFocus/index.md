---
title: useFocus
toc: content
---

# useFocus

判断输入组件是否聚焦

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useFocus } from 'rc-use-hooks';
```

### Params

|     参数     |     说明     |                              类型                              |  默认值  |
| :----------: | :----------: | :------------------------------------------------------------: | :------: |
|    target    |   dom节点    | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` | `window` |
| defaultState | 初始是否聚焦 |                           `boolean`                            | `false`  |

### Result

|  参数   |   说明   |   类型    | 默认值 |
| :-----: | :------: | :-------: | :----: |
| focused | 是否聚焦 | `boolean` |  `-`   |
