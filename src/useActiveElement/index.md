---
title: useActiveElement
toc: content
nav:
  path: /
---

# useActiveElement

跟踪当前活跃的元素

## 代码演示

<code src='./Demo.tsx'></code>

### API

```ts
import { useActiveElement } from 'rc-use-hooks';
const activeElement = useActiveElement();
```

### Result

| 参数          | 说明           | 类型                  | 默认值 |
| ------------- | -------------- | --------------------- | ------ |
| activeElement | 当前活跃的元素 | `HTMLElement \| null` | `-`    |
