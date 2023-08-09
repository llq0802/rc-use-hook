---
title: useWindowSize
toc: content
---

# useWindowSize

使用`IntersectionObserver`实现的懒加载图像，在组件卸载或者图像已经加载后不再监听

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

```ts
import { useWindowSize } from 'rc-use-hook';
```

### Params

|   参数   |  说明  |           类型           |
| :------: | :----: | :----------------------: |
| paramObj | 配置项 | `useLazyLoadImageParams` |

### useLazyLoadImageParams

```ts
export type useLazyLoadImageParams = {
  /** 在哪个节点下查询 querySelectorAll */
  target?: HTMLDivElement | Document; //  默认为 document
  /** querySelectorAll抓取在 `target` 所有可延迟加载的图像的自定义属性 */
  imageAttribute?: `data-${string}`; // 默认为 data-img-src
  /** IntersectionObserver 的配置项*/
  options?: IntersectionObserverInit; // 默认为 { rootMargin: '100px 0px' , threshold: 0.01, };
  /** 依赖项 如果配置会重新执行监听 */
  dependencies?: any[]; // 默认为 []
};
```
