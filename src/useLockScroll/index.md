---
title: useLockScroll
toc: content
---

# useLockScroll

设置锁定元素的滚动, 常用于弹窗 抽屉等组件

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

### 自定义锁定元素

<code src="./demos/Demo2.tsx" ></code>

## API

```ts
import { useLockScroll } from 'rc-use-hooks';
const [lock, setLock] = useLockScroll(target, initLock, scrollW);
```

### Params

| 参数     | 说明         | 类型                                                           | 默认值          |
| -------- | ------------ | -------------------------------------------------------------- | --------------- |
| target   | 被锁定的元素 | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` | `document.body` |
| initLock | 初始是否锁定 | `boolean`                                                      | `false`         |
| scrollW  | 滚动条宽度   | `number`                                                       | `17`            |

### Result

与`React.useState`的返回值一致
