---
title: useBeforeUnload
toc: content
nav:
  path: /
---

# useBeforeUnload

与 useState 效果一致，可在 setState 的第二个参数回调函数中接受最新的 state ，可像类组件的 this.state 的回调函数。

## 代码演示

<code src='./demos/Demo1.tsx'></code>

### API

```ts
import { useBeforeUnload } from 'rc-use-hook';
useBeforeUnload(enabled:boolean, message?:string);
```

### Params

| 参数    | 说明                          | 类型      | 默认值 |
| ------- | ----------------------------- | --------- | ------ |
| enabled | 是否启用                      | `boolean` | `true` |
| message | 自定义提示信息 部分浏览器无效 | `string`  | `-`    |
