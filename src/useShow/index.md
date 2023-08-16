---
title: useShow
toc: content
---

# useShow

父组件通过 ref 唤起子组件 、用于业务功能代码分离、避免过多状态和业务代码集中在一个文件上。

基于 `useImperativeHandle`、可以相互传参。各组件拥有独立的状态、状态更新也不会造成其他组件重复执行。

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

> 兄弟组件传值、监听推荐使用 `Event`，不要把 `useEffect` 当做 `wacth` 来用，尽量把变化写在事件中！

### 父组件调用

```ts
const funRef = useRef<OnShowInstance>();

funRef.current?.onShow(data); // 触发子组件方法onShow
funRef.current?.onHide(data); // 触发子组件方法onHide
funRef.current?.getChildData(); // 获取子组件数据

<ChildModel funcRef={funRef} />;
```

### 子组件调用

```ts
import { useShow } from 'rc-use-hooks';

// <ChildModel funcRef={funRef} />;
/**
 *  parentData 父组件调用onShow传给子组件的参数
 *  setParentData 子组件执行方法，往内部ref存放数据、父组件使用getChildData函数获取子组件数据
 */
const { parentData, setParentData }:UseShowResult = useShow<T extends Record<string,any>>(funRef, {
  onShow: (data:T) => void, // 父组件执行onShow的时候触发
  onHide: (data?: T) => void, // 父组件执行onHide的时候触发
  onFormart: (data:T) => any, // 格式化父组件调用onShow传入的参数parentData
});
```

### Params

|  参数   |         说明         |                   类型                    |
| :-----: | :------------------: | :---------------------------------------: |
| funRef  | 从父组件传过来的 ref | `UseShowInstance<T = Record<string,any>>` |
| options |       配置参数       | ` UseShowOptions<T = Record<string,any>>` |

### Result

|              参数              |                       说明                       |      类型       |
| :----------------------------: | :----------------------------------------------: | :-------------: |
| `{ parentData,setParentData }` | 父组件调用 onShow 传入的数据传给父组件数据的方法 | `UseShowResult` |

### 导出类型

```ts
/**useShow 的实例 (包含一些方法) */
export declare type UseShowInstance<
  T extends Record<string, any> = Record<string, any>,
> = {
  /** 触发子组件的 onShow 方法并传值 */
  onShow(record: T): void;
  /** 触发子组件的 onHide 方法并传值 */
  onHide: (record?: T) => void;
  /** 获取子组件的数据 ( 通过子组件 setParentData( ) 设置 )*/
  getChildData: () => any;
};

/**useShow 的配置项 */
export declare type UseShowOptions<
  T extends Record<string, any> = Record<string, any>,
> = {
  /** show 触发事件 */
  onShow?(data: T): void;
  /** hide 触发事件 */
  onHide?: (data?: T) => void;
  /** 格式化 data */
  onFormart?: (data: T) => any;
};

/**用于在子组件 props 的 'funcRef' 的类型*/
export declare type UseShowInstanceRef<
  T extends Record<string, any> = Record<string, any>,
> = MutableRefObject<UseShowInstance<T> | undefined>;

export declare type UseShowResult<T> = {
  /** 父组件 useShow 实例调用 onShow 事件传入的参数 */
  parentData: T | undefined;
  /** 向父组件传数据 （父组件调用 getChildData( ) 获取 ） */
  setParentData: (data: any) => void;
};
```
