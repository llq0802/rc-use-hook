---
title: useLazyImage
toc: content
---

# useLazyImage

使用`IntersectionObserver`实现的懒加载图像，在组件卸载或者图像已经加载后不再监听

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

### antd.Image

<code src="./demos/Demo2.tsx" ></code>

### 自定义视口

<code src="./demos/Demo3.tsx" ></code>

## API

IntersectionObserver API: [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)

> - `imageAttribute` 必须以`data-`开头的字符串并且只能是小写字母
> - `img` 的 `src` 属性推荐设置为默认占位的图片地址

```ts
import { useLazyLoadImage } from 'rc-use-hooks';
useLazyLoadImage();
// or
useLazyLoadImage({
  // ...配置项
});
```

### Params

|   参数   |  说明  |         类型         |
| :------: | :----: | :------------------: |
| paramObj | 配置项 | `UseLazyImageParams` |

### UseLazyImageParams

```ts
export type UseLazyImageParams = {
  /** 在哪个节点下查询 querySelectorAll */
  target?: MutableRefObject<HTMLElement | null> | (() => HTMLElement); //  默认为 document
  /** querySelectorAll抓取在 `target` 所有可延迟加载的图像的自定义属性 */
  imageAttribute?: `data-${string}`; // 默认为 data-img-src
  /** IntersectionObserver 的配置项*/
  options?: Omit<IntersectionObserverInit, 'root'> & {
    root: MutableRefObject<HTMLElement | null> | (() => HTMLElement);
  }; // 默认为 { rootMargin: '0px 0px 200px 0px' , threshold: 0.01, };

  /** 依赖项 如果配置会重新执行监听 */
  dependencies?: any[]; // 默认为 []
};
```
