---
title: useBeforeUnload
toc: content
nav:
  path: /
---

# useBeforeUnload

窗口关闭或刷新的提示

## 代码演示

<code src='./demos/Demo1.tsx'></code>

### API

```ts
import { useBeforeUnload } from 'rc-use-hooks';
useBeforeUnload(enabled:boolean, message?:string);
```

### Params

| 参数    | 说明                          | 类型      | 默认值 |
| ------- | ----------------------------- | --------- | ------ |
| enabled | 是否启用                      | `boolean` | `true` |
| message | 自定义提示信息 部分浏览器无效 | `string`  | `-`    |
