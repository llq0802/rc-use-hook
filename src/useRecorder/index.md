---
title: useAudio
toc: content
nav:
  path: /
---

# useAudio

音频钩子函数，用于管理音频的播放状态和操作

## 代码演示

<code src='./Demo1.tsx'></code>

### API

```ts
import { useAudio } from 'rc-use-hooks';
const useAudio: (src: string, opts?: UseAudioOptions) => UseAudioReturn;
```

### Params

| 参数 | 说明                      | 类型              | 默认值 |
| ---- | ------------------------- | ----------------- | ------ |
| src  | 音频地址 推荐使用Blob地址 | `string`          | `-`    |
| opts | 配置项                    | `UseAudioOptions` | `-`    |

### Result

| 参数 | 说明     | 类型                                         | 默认值 |
| ---- | -------- | -------------------------------------------- | ------ |
| ret  | 返回对象 | `音频钩子函数，用于管理音频的播放状态和操作` | `-`    |

### 类型定义

```ts
export type UseAudioReturn = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
};

export type UseAudioOptions = {
  onPlay?: (value: any) => void;
  onPlaying?: (e: any) => void;
  onPause?: () => void;
  onStop?: () => void;
  onEnd?: (e: any) => void;
};
```
