---
title: usePageLoadType
toc: content
---

# usePageLoadType

用于在页面加载时获取页面加载类型

可判断页面是否刷新

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

```ts
import { usePageLoadType } from 'rc-use-hooks';

usePageLoadType(cb: (type: PageLoadEnum) => void);

enum PageLoadEnum {
  BACK_FORWAR = 'back_forward',
  NAVIGATE = 'navigate',
  RELOAD = 'reload',
}

```
