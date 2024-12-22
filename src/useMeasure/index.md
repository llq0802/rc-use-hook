---
title: useMeasure
toc: content
---

# useMeasure

用于测量元素的`尺寸`和`位置`

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

```ts
import { useMeasure } from 'rc-use-hooks';
```

### Params

|  参数  |  说明   |                              类型                              |      类型       |
| :----: | :-----: | :------------------------------------------------------------: | :-------------: |
| target | dom节点 | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` | `document.body` |

### Result

| 参数 |        说明        |  类型  |
| :--: | :----------------: | :----: |
| rect | 元素位置与尺寸信息 | `Rect` |

```ts
export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
};
```
