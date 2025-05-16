---
title: useRecorder
toc: content
nav:
  path: /
---

# useRecorder

音频钩子函数，用于管理音频的播放状态和操作

## 代码演示

<code src='./Demo1.tsx'></code>
<code src='./Demo2.tsx'></code>
<code src='./Demo3.tsx'></code>

### API

```ts
import { useRecorder } from 'rc-use-hooks';
const useRecorder: (opts?: UseRecorderOptions) => UseRecorderReturn;
```

### Params

| 参数 | 说明   | 类型                 | 默认值 |
| ---- | ------ | -------------------- | ------ |
| opts | 配置项 | `UseRecorderOptions` | `-`    |

### Result

| 参数 | 说明     | 类型                | 默认值 |
| ---- | -------- | ------------------- | ------ |
| ret  | 返回对象 | `UseRecorderReturn` | `-`    |

### 类型定义

```ts
export type UseRecorderOptions = {
  timeout?: number;
  audioType?: string;
  audioOptions?: true | MediaTrackConstraints;
  onStart?: () => void;
  onEnd?: (...args: any[]) => void;
  onProcess?: (
    pcmData: number[],
    powerLevel: number,
    sampleRate: number,
  ) => void;
  onTimeOut?: () => void;
};

export type UseRecorderReturn = {
  isOpening: boolean;
  isRecording: boolean;
  error: string | null;
  blobUrl: string | null;
  base64Url: string | null;
  size: number | null;
  countdown: number;
  start: () => void;
  cancel: () => void;
  stop: () => void;
};
```
