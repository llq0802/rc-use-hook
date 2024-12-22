---
title: useEnterDirection
toc: content
---

# useEnterDirection

精准返回鼠标进入盒子的方向 `top` `right` `bottom` `left`

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useEnterDirection } from 'rc-use-hooks';
```

### Params

|  参数  |  说明   |                              类型                              | 默认值 |
| :----: | :-----: | :------------------------------------------------------------: | :----: |
| target | dom节点 | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` |  `-`   |

### Result

|   参数    |      说明      |                   类型                    |   默认值    |
| :-------: | :------------: | :---------------------------------------: | :---------: |
| direction | 鼠标进入的方向 | `top` `right` `bottom` `left` `undefined` | `undefined` |
