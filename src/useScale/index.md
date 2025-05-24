---
title: useScale
toc: content
---

# useScale

自适应缩放的布局，用于确保固定尺寸的内容在不同大小的屏幕上能够完整显示并保持比例。

## API

```ts
import { useScale } from 'rc-use-hooks';
```

### 基本用法

```tsx|pure
import { useScale } from 'rc-use-hooks';
import { useRef } from 'react';

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useScale(containerRef, {
    designWidth: 1920,
    designHeight: 1080,
    transition: 'transform 0.3s',
  });

  return (
    <div ref={containerRef} style={{ width: 1920, height: 1080 }}>
      {/* 你的内容 */}
    </div>
  );
};
```

### Params

|  参数   |  说明   |                              类型                              | 默认值 |
| :-----: | :-----: | :------------------------------------------------------------: | :----: |
| target  | dom节点 | `MutableRefObject<HTMLElement \| null> \| (() => HTMLElement)` |  `-`   |
| options |  配置   |                           `Options`                            |  `-`   |

```ts
interface Options {
  clientWidth?: number;
  clientHeight?: number;
  designWidth?: number;
  designHeight?: number;
  wait?: number;
  transition?: string;
}
```
