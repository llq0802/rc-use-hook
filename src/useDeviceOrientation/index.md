---
title: useDeviceOrientation
toc: content
---

# useDeviceOrientation

使用 `window.matchMedia('(orientation: portrait)')` 来检查屏幕方向, 并对Safari做了降级处理

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

> `portrait` 为竖屏, `landscape`为横屏

```ts
import { useDeviceOrientation } from 'rc-use-hooks';
```

### Result

|    参数     |   说明   |            类型             | 默认值 |
| :---------: | :------: | :-------------------------: | :----: |
| orientation | 屏幕方向 | `'portrait' \| 'landscape'` |  `-`   |
