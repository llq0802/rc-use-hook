---
title: useMergedRef
toc: content
---

# useMergedRef

监听页面离开事件，当鼠标移出页面或页面失去焦点时返回 true。

只要鼠标不在文档中，就认为页面已离开。包含`鼠标在标签页`或者`调试台`或者`切换浏览器标签页`

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

```ts
import { useMergedRef } from 'rc-use-hooks';
```

### Result

|  参数   |     说明     |   类型    |
| :-----: | :----------: | :-------: |
| isLeave | 是否离开文档 | `boolean` |
