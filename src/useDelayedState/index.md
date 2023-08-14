---
title: useDelayedState
toc: content
nav:
  path: /
---

# useDelayedState

延迟创建状态，直到满足某些条件。

## 代码演示

<code src='./demos/Demo1.tsx'></code>

### API

```ts
import { useDelayedState } from 'rc-use-hook';
const [state, setState] = useDelayedState(initState, condition);
```

### Params

| 参数      | 说明                                | 类型      | 默认值 |
| --------- | ----------------------------------- | --------- | ------ |
| initState | 初始状态数据                        | `any`     | `-`    |
| condition | 状态创建的条件 为`true`才有创建有值 | `boolean` | `-`    |

### Result

与 `React.setState` 返回值一致
