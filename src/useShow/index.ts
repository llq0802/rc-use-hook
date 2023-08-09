import { cloneDeep } from 'lodash-es';
import {
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';

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

export declare type UseShowResult<T extends Record<string, any>> = {
  /** 父组件 useShow 实例调用 onShow 事件传入的参数 */
  parentData: T | undefined;
  /** 向父组件传数据 （父组件调用 getChildData( ) 获取 ） */
  setParentData: (data: any) => void;
};

/**
 * 父调用子组件方法，并传值更新状态
 * @param funcRef ref对象
 * @param options { onShow, onFormart, onHide }
 * @returns T 传输的数据
 */
export default function useShow<
  T extends Record<string, any> = Record<string, any>,
>(
  funcRef: UseShowInstanceRef<T>,
  options: UseShowOptions<T>,
): UseShowResult<T> {
  const ref = useRef<any>();
  const childrenDataRef = useRef<any>();
  const opsOnShow = options.onShow,
    opsOnFormart = options.onFormart,
    opsOnHide = options.onHide;

  useImperativeHandle(funcRef, () => {
    return {
      onShow(data) {
        ref.current = cloneDeep(data);
        if (opsOnShow) opsOnShow(ref.current);
      },

      onHide(data) {
        if (opsOnHide) opsOnHide(cloneDeep(data));
      },

      getChildData() {
        return childrenDataRef.current;
      },
    };
  });

  const onCallback = useCallback(<T = any>(data: T) => {
    childrenDataRef.current = data;
  }, []);

  return {
    parentData: opsOnFormart ? opsOnFormart(ref.current) : ref.current,
    setParentData: onCallback,
  };
}
