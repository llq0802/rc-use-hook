---
title: useLocalForage
toc: content
---

# useLocalForage

使用 `localForage` 管理状态的hook

## 代码演示

### 基础用法

<code src="./demos/demo1.tsx" ></code>

## API

```ts
import { useLocalForage } from 'rc-use-hooks';

const [value, setValueInStorage, removeValueFromStorage] = useLocalForage(
  key,
  defaultValue,
);
```

与 React.useState 一致
