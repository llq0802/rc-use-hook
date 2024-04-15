import { cloneDeep } from 'lodash-es';
import {
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

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

/**
 * 父调用子组件方法，并传值更新状态
 *  - ( 通常用于 Modal 或 Drawer 中 )
 * @param funcRef 任意名称的 useShow 的实例  `( ref 对象 )`
 * @param options  配置项
 * @returns 父组件调用onShow穿过来的值与传给父组件值的方法
 */
export default function useShow<
  T extends Record<string, any> = Record<string, any>,
>(
  funcRef: UseShowInstanceRef<T>,
  options: UseShowOptions<T>,
): UseShowResult<T> {
  const [open, setOpen] = useState(false);
  const childrenDataRef = useRef<any>();
  const showRecordRef = useRef<any>();
  const hideRecordRef = useRef<any>();
  const opsOnShow = options.onShow,
    opsOnHide = options.onHide,
    opsShowFormart = options.showFormart,
    opsHideFormart = options.hideFormart;

  useImperativeHandle(funcRef, () => {
    return {
      onShow(data) {
        const record = (showRecordRef.current = cloneDeep(data));
        setOpen(true);
        opsOnShow?.(record);
      },

      onHide(data) {
        const record = (hideRecordRef.current = cloneDeep(data));
        setOpen(false);
        opsOnHide?.(record);
      },

      getChildData() {
        return childrenDataRef.current;
      },
    };
  });

  const setParentData = useCallback(<T = any>(data: T) => {
    childrenDataRef.current = cloneDeep(data);
  }, []);

  const updateOpen = useCallback((o: boolean) => {
    setOpen(o);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const clear = useCallback(() => {
    childrenDataRef.current = void 0;
    showRecordRef.current = void 0;
    hideRecordRef.current = void 0;
  }, []);

  const showRecord = opsShowFormart
    ? opsShowFormart(showRecordRef.current)
    : showRecordRef.current;
  const hideRecord = opsHideFormart
    ? opsHideFormart(hideRecordRef.current)
    : hideRecordRef.current;
  return {
    setParentData,
    showRecord,
    hideRecord,
    open,
    updateOpen,
    close,
    clear,
  };
}
