---
title: useRequestPro
toc: content
---

# useRequestPro

允许在父组件之外呈现子组件, 自定义挂载到元素下, 常用于弹窗等。

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useRequestPro } from 'rc-use-hooks';
```

### Params

| 参数 |           说明           |     类型      |     默认值      |
| :--: | :----------------------: | :-----------: | :-------------: |
|  el  | 自定义挂载到哪个元素下面 | `HTMLElement` | `document.body` |

### Result

|  参数  |   说明   |               类型                | 默认值 |
| :----: | :------: | :-------------------------------: | :----: |
| Portal | 容器组件 | `({children}) => React.ReactNode` |  `-`   |
