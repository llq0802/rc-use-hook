import { cloneDeep } from 'lodash-es';
import {
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// 定义一个通用的记录类型
/**
 * 通用的记录类型
 * @template T - 记录的类型，默认为 `Record<string, any>`
 */
export type RecordType<T = Record<string, any>> = T;

// 定义 UseShow 的实例类型
/**
 * UseShow 的实例类型
 * @template T - 记录的类型，默认为 `RecordType`
 */
export interface UseShowInstance<T extends RecordType = RecordType> {
  /**
   * 显示记录
   * @param record - 要显示的记录
   */
  onShow(record?: T): void;
  /**
   * 隐藏记录
   * @param record - 要隐藏的记录
   */
  onHide(record?: T): void;
  /**
   * 获取子组件的数据
   * @returns 子组件的数据
   */
  getChildData(): any;
}

// 定义 UseShow 的配置项类型
/**
 * UseShow 的配置项类型
 * @template T - 记录的类型，默认为 `RecordType`
 */
export interface UseShowOptions<T extends RecordType = RecordType> {
  /**
   * 显示记录时的回调函数
   * @param record - 显示的记录
   */
  onShow?(record: T | undefined): void;
  /**
   * 隐藏记录时的回调函数
   * @param record - 隐藏的记录
   */
  onHide?(record?: T): void;
  /**
   * 格式化显示记录的函数
   * @param record - 显示的记录
   * @returns 格式化后的记录
   */
  showFormart?(record: T): any;
  /**
   * 格式化隐藏记录的函数
   * @param record - 隐藏的记录
   * @returns 格式化后的记录
   */
  hideFormart?(record: T): any;
}

// 定义 UseShow 的实例引用类型
/**
 * UseShow 的实例引用类型
 * @template T - 记录的类型，默认为 `RecordType`
 */
export type UseShowInstanceRef<T extends RecordType = RecordType> =
  MutableRefObject<UseShowInstance<T> | undefined>;

// 定义 UseShow 的结果类型
/**
 * UseShow 的结果类型
 * @template T - 记录的类型，默认为 `RecordType`
 */
export interface UseShowResult<T extends RecordType = RecordType> {
  /**
   * 设置父组件的数据
   * @param data - 父组件的数据
   */
  setParentData: (data: any) => void;
  /**
   * 显示的记录
   */
  showRecord: T | undefined;
  /**
   * 隐藏的记录
   */
  hideRecord: T | undefined;
  /**
   * 是否打开
   */
  open: boolean;
  /**
   * 更新打开状态
   * @param b - 打开状态
   */
  updateOpen: (b: boolean) => void;
  /**
   * 关闭
   */
  close: () => void;
  /**
   * 清除数据
   */
  clear: () => void;
}

/**
 * 父调用子组件方法，并传值更新状态
 *
 * 此钩子写在子组件中, 父组件通过 ref 调用
 *
 *  - ( 通常用于 Modal 或 Drawer 中 )
 * @template T - 记录的类型，默认为 `RecordType`
 * @param funcRef - 任意名称的 useShow 的实例 `( ref 对象 )`
 * @param [options] - 配置项
 * @returns 父组件调用onShow穿过来的值与传给父组件值的方法
 */
export default function useShow<T extends RecordType = RecordType>(
  funcRef: UseShowInstanceRef<T>,
  options: UseShowOptions<T> = {},
): UseShowResult<T> {
  const [open, setOpen] = useState(false);
  const childrenDataRef = useRef<any>();
  const showRecordRef = useRef<any>();
  const hideRecordRef = useRef<any>();

  const {
    onShow: opsOnShow,
    onHide: opsOnHide,
    showFormart: opsShowFormart,
    hideFormart: opsHideFormart,
  } = options;

  useImperativeHandle(funcRef, () => ({
    /**
     * 显示记录
     * @param data - 要显示的记录
     */
    onShow(data) {
      const record = (showRecordRef.current = cloneDeep(data));
      setOpen(true);
      opsOnShow?.(record);
    },
    /**
     * 隐藏记录
     * @param data - 要隐藏的记录
     */
    onHide(data) {
      const record = (hideRecordRef.current = cloneDeep(data));
      setOpen(false);
      opsOnHide?.(record);
    },
    /**
     * 获取子组件的数据
     * @returns 子组件的数据
     */
    getChildData() {
      return childrenDataRef.current;
    },
  }));

  /**
   * 设置父组件的数据
   * @param data - 父组件的数据
   */
  const setParentData = useCallback((data: any) => {
    childrenDataRef.current = cloneDeep(data);
  }, []);

  /**
   * 更新打开状态
   * @param o - 打开状态
   */
  const updateOpen = useCallback((o: boolean) => {
    setOpen(o);
  }, []);

  /**
   * 关闭
   */
  const close = useCallback(() => {
    setOpen(false);
  }, []);

  /**
   * 清除数据
   */
  const clear = useCallback(() => {
    childrenDataRef.current = undefined;
    showRecordRef.current = undefined;
    hideRecordRef.current = undefined;
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
