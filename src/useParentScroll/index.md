---
title: useParentScroll
toc: content
---

# useParentScroll

从给定的ele元素开始，遍历所有父元素直到document的根元素(document.body)。对于每个父节点，检查它是否是一个可滚动的节点。

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useParentScroll } from 'rc-use-hook';
```

### Params

|  参数  |  说明   |                              类型                              | 默认值 |
| :----: | :-----: | :------------------------------------------------------------: | :----: |
| target | dom节点 | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` |  `-`   |

### Result

| 参数 |     说明     |     类型      | 默认值 |
| :--: | :----------: | :-----------: | :----: |
| dom  | 可滚动的节点 | `HTMLElement` | `null` |
