---
title: useShow
toc: content
---

# useShow

父组件通过 ref 唤起子组件 、用于业务功能代码分离、避免过多状态和业务代码集中在一个文件上。
可以相互传参, 各组件拥有独立的状态、状态更新也不会造成其他组件重复执行。

## 代码演示

### 基础用法

<code src="./demos/Demo1.tsx" ></code>

## API

> 兄弟组件传值、监听推荐使用 `Event`，不要把 `useEffect` 当做 `wacth` 来用，尽量把变化写在事件中！

### 父组件调用

```ts
const funRef = useRef<UseShowInstance>();

funRef.current?.onShow(data); // 触发子组件方法onShow
funRef.current?.onHide(data); // 触发子组件方法onHide
funRef.current?.getChildData(); // 获取子组件数据

<ChildModel funcRef={funRef} />;
```

### 子组件调用

```ts
import { useShow } from 'rc-use-hooks';

// funRef 为通过 props 传递的 ref 实例
const ret :UseShowResult = useShow(funRef, {
  /** show 触发事件 */
  onShow?(record: T): void;
  /** hide 触发事件 */
  onHide?: (record?: T) => void;
  /** 格式化 onShow 的参数 record */
  showFormart?: (record: T) => any;
  /** 格式化 onHide 的参数 record */
  hideFormart?: (record: T) => any;
});

```

### Params

|  参数   |         说明         |                   类型                    |
| :-----: | :------------------: | :---------------------------------------: |
| funRef  | 从父组件传过来的 ref | `UseShowInstance<T = Record<string,any>>` |
| options |       配置参数       | ` UseShowOptions<T = Record<string,any>>` |

### Result

|   参数   |        说明        |      类型       |
| :------: | :----------------: | :-------------: |
| `result` | 查看 UseShowResult | `UseShowResult` |

### 导出类型

```ts
/**useShow 的实例 (包含一些方法) */
export declare type UseShowInstance<
  T extends Record<string, any> = Record<string, any>,
> = {
  /** 触发 useShow 的 onShow 配置项方法并传值 */
  onShow(record: T): void;
  /** 触发 useShow 的 onHide 配置项方法并传值 */
  onHide: (record?: T) => void;
  /** 获取 useShow 的 setParentData() 设置的值 */
  getChildData: () => any;
};

/**useShow 的配置项 */
export declare type UseShowOptions<
  T extends Record<string, any> = Record<string, any>,
> = {
  /** show 触发事件 */
  onShow?(record: T): void;
  /** hide 触发事件 */
  onHide?: (record?: T) => void;
  /** 格式化 onShow 的参数 record */
  showFormart?: (record: T) => any;
  /** 格式化 onHide 的参数 record */
  hideFormart?: (record: T) => any;
};

/**用于在子组件 props 的 useShow 的实例的类型*/
export declare type UseShowInstanceRef<
  T extends Record<string, any> = Record<string, any>,
> = MutableRefObject<UseShowInstance<T> | undefined>;

/**useShow 的返回值 */
export declare type UseShowResult<T extends Record<string, any>> = {
  /** 向父组件传数据 （父组件调用 getChildData( ) 获取 ） */
  setParentData: (data: any) => void;
  /** 父组件 useShow 实例调用 onShow 事件传入的参数 */
  showRecord: T | undefined;
  /** 父组件 useShow 实例调用 onHide 事件传入的参数 */
  hideRecord: T | undefined;
  /** 配合 Modal 或 Drawer 配置 open */
  open: boolean;
  /**更新 open  */
  updateOpen: (b: boolean) => void;
  /** 配合 Modal 或 Drawer 触发 onClose 事件 */
  close: () => void;
  /**清空传值的数据 */
  clear: () => void;
};
```
