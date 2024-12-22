---
title: useClipboard
toc: content
---

# useClipboard

用于将文字剪切到用户的剪切板

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

### Params

|      参数       |               说明                |   类型   |
| :-------------: | :-------------------------------: | :------: |
| successDuration | 复制成功后多久变回初始状态 默认1s | `number` |

### Result

数组第一项表示是否点击了复制, 数组第二项表示是设置复制内容的函数

|         参数          |       说明       |                类型                |
| :-------------------: | :--------------: | :--------------------------------: |
| [isCopied, setCopied] | 类似于`useState` | `[boolean, (str: string) => void]` |
