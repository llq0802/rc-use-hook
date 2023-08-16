---
title: useMedia
toc: content
---

# useMedia

使用`window.matchMedia`检查视口是否与给定的媒体查询匹配，并返回 `boolean`

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useMedia } from 'rc-use-hooks';
```

### Params

| 参数  |              说明              |   类型   |
| :---: | :----------------------------: | :------: |
| query | 媒体查询,与 css 的媒体查询一致 | `string` |

### Result

|  参数   |    说明    |   类型    |
| :-----: | :--------: | :-------: |
| matches | 是否匹配到 | `boolean` |
