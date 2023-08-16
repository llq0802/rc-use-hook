---
title: useWindowSize
toc: content
---

# useWindowSize

实时返回窗口的宽高

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

> - window.innerHeight不包括浏览器的 `地址栏` `收藏栏`
> - window.outerHeight包括浏览器的 `地址栏` `收藏栏`

```ts
import { useWindowSize } from 'rc-use-hooks';
```

### Params

|   参数   |      说明      |   类型   | 类型  |
| :------: | :------------: | :------: | :---: |
| waitTime | 防抖的延迟时间 | `number` | `200` |

### Result

|    参数    |    说明    |                                       类型                                        |
| :--------: | :--------: | :-------------------------------------------------------------------------------: |
| windowSize | 窗口的宽高 | `{  innerHeight:number,innerWidth: number,outerHeight:number,outerWidth: number}` |
