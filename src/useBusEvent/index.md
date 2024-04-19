---
title: useBusEvent
toc: content
nav:
  path: /
---

# useBusEvent

基于发布订阅模式的事件总线

通过 props 或者 Context ，可以将 busEvent 共享给其他组件。然后在其他组件中，可以调用 BusEvent 的 emit 方法，发布一个事件，或是调用 subscription 方法，订阅事件。

## 代码演示

<code src='./demos/Demo1.tsx'></code>

### API

```ts
import { useBusEvent } from 'rc-use-hooks';
const busEvent = useBusEvent<K = string , T = any>();
```

### Result

| 参数         | 说明             | 类型                                                        |
| ------------ | ---------------- | ----------------------------------------------------------- |
| emit         | 发布一个事件通知 | `(key:string\|symbol , val: T) => void`                     |
| subscription | 订阅对应事件通知 | `(key:string\|symbol , callback: (val: T) => void) => void` |
