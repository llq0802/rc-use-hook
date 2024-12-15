---
title: usePageLoadType
toc: content
---

# usePageLoadType

在组件 **将要挂载** 时触发

此时将访问不到组件的 DOM

## 代码演示

### 基础用法

<code src="./Demo1.tsx" ></code>

## API

> 此时将访问不到组件的 DOM

```ts
import { useWillMount } from 'rc-use-hooks';

useWillMount(fn: () => void);
```
