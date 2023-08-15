---
title: useImageSize
toc: content
---

# useImageSize

获取图像的原始宽高

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useImageSize } from 'rc-use-hook';
```

### Params

| 参数 |      说明       |   类型   | 默认值 |
| :--: | :-------------: | :------: | :----: |
| url  | 图像的 url 地址 | `string` |  `-`   |

### Result

| 参数 |      说明      |       类型       | 默认值  |
| :--: | :------------: | :--------------: | :-----: |
| size | 返回的原始宽高 | `[width,height]` | `[0,0]` |
