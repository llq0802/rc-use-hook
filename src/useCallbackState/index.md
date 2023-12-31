---
title: useCallbackState
toc: content
nav:
  path: /
---

# useCallbackState

与 useState 效果一致，可在 setState 的第二个参数回调函数中接受最新的 state ，可像类组件的 this.state 的回调函数。

## 代码演示

<code src='./demos/Demo1.tsx'></code>

### API

```ts
import { useCallbackState } from 'rc-use-hooks';
const [state, setState] = useCallbackState(initialState);
```

### state

| 参数  | 说明       | 类型                |
| ----- | ---------- | ------------------- |
| state | state 的值 | `SetStateAction<T>` |

### setState

|   参数   |                             说明                              |                                        类型                                         |
| :------: | :-----------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| setState | 第一个参数传入新的 state,第二个参数为函数接受最新传入的 state | `(newState: SetStateAction<T>, cb?: (newState: SetStateAction<T>) => void) => void` |
