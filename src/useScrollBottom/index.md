---
title: useScrollBottom
toc: content
---

# useScrollBottom

判断是否滚动到底部

## 代码演示

### 基础用法

<code src="./demo1.tsx" ></code>

## API

```ts
import { useScrollBottom } from 'rc-use-hooks';
```

### Params

|     参数     |  说明   |                              类型                              | 默认值  |
| :----------: | :-----: | :------------------------------------------------------------: | :-----: |
|    target    | dom节点 | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` |   `-`   |
| defaultState | 初始值  |                           `boolean`                            | `false` |

### Result

|   参数   |      说明      |   类型    | 默认值  |
| :------: | :------------: | :-------: | :-----: |
| bottomed | 是否滚动到底部 | `boolean` | `false` |
