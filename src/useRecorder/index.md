---
title: useRecorder
toc: content
nav:
  path: /
---

# useRecorder

一个用于录音的 React Hook，支持音频录制、波形显示和音量监测。

## 介绍

`useRecorder` 提供了完整的录音功能，包括开始录音、停止录音、取消录音等操作。支持音频格式配置、录音时长限制、音频数据实时处理等特性。

> 注意：要求运行在 HTTPS 或 localhost 环境下，并且用户需授予麦克风权限。

## 代码演示

<code src='./Demo1.tsx'></code>

<code src='./Demo2.tsx'></code>

<!-- <code src='./Demo3.tsx'></code> -->

<code src='./Demo4.tsx'></code>

<code src='./Demo5.tsx'></code>

## API

### Options

| 参数         | 说明                                       | 类型                                                                  | 默认值  |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------- | ------- |
| timeout      | 最大录音时长（秒）                         | `number`                                                              | 3600    |
| fftSize      | 音频分析器的 FFT 大小                      | `number`                                                              | 2048    |
| audioType    | 音频格式                                   | `'mp3'` \| `'ogg'` \| `'webm'` \| `'wav'` \| `string`                 | `'wav'` |
| audioOptions | 音频配置选项                               | `true` \| `MediaTrackConstraints`                                     | `true`  |
| onStart      | 开始录音时的回调函数                       | `() => void`                                                          | -       |
| onEnd        | 结束录音时的回调函数                       | `(blob: Blob, duration: number, ...args: any[]) => void`              | -       |
| onProcess    | 录音过程中的回调函数，用于实时处理音频数据 | `(pcmData: number[], powerLevel: number, sampleRate: number) => void` | -       |
| onTimeOut    | 录音超时的回调函数                         | `() => void`                                                          | -       |
| onError      | 错误处理回调函数                           | `(err: any) => void`                                                  | -       |

### Result

| 参数        | 说明                   | 类型                         |
| ----------- | ---------------------- | ---------------------------- |
| isOpening   | 是否正在打开麦克风     | `boolean`                    |
| isRecording | 是否正在录音           | `boolean`                    |
| error       | 错误信息               | `string` \| `null`           |
| blobUrl     | 录音文件的 Blob URL    | `string` \| `null`           |
| base64Url   | 录音文件的 Base64 URL  | `string` \| `null`           |
| size        | 录音文件大小（字节）   | `number` \| `null`           |
| countdown   | 剩余录音时间（秒）     | `number`                     |
| duration    | 已录制时长（秒）       | `number`                     |
| start       | 开始录音               | `() => void`                 |
| cancel      | 取消录音               | `() => void`                 |
| stop        | 停止录音               | `() => void`                 |
| audioData   | 音频数据（Uint8Array） | `number[]`                   |
| stream      | 媒体流对象             | `MediaStream` \| `undefined` |

### audioOptions 配置示例

```typescript
{
  autoGainControl: false, // 关闭自动增益控制
  channelCount: 2,        // 设置音频通道数
  echoCancellation: false, // 关闭回声消除
  noiseSuppression: true,  // 开启噪音抑制
  sampleRate: 44100,      // 设置音频采样率
  sampleSize: 16,         // 设置音频样本大小
}
```

### 备注

1. 录音数据实时处理：通过 `onProcess` 回调可以获取实时的音频数据和音量级别
2. 自动超时处理：到达 `timeout` 设定的时间后会自动停止录音
3. 多种音频格式：支持 mp3、ogg、webm、wav 等常见音频格式
4. 音频数据格式：支持 Blob URL 和 Base64 两种格式的音频数据输出

```

```
