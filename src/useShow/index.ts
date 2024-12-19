import { cloneDeep } from 'lodash-es';
import {
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// 定义一个通用的记录类型
export type RecordType<T = Record<string, any>> = T;

// 定义 UseShow 的实例类型
export interface UseShowInstance<T extends RecordType = RecordType> {
  onShow(record?: T): void;
  onHide(record?: T): void;
  getChildData(): any;
}

// 定义 UseShow 的配置项类型
export interface UseShowOptions<T extends RecordType = RecordType> {
  onShow?(record: T): void;
  onHide?(record?: T): void;
  showFormart?(record: T): any;
  hideFormart?(record: T): any;
}

// 定义 UseShow 的实例引用类型
export type UseShowInstanceRef<T extends RecordType = RecordType> =
  MutableRefObject<UseShowInstance<T> | undefined>;

// 定义 UseShow 的结果类型
export interface UseShowResult<T extends RecordType = RecordType> {
  setParentData: (data: any) => void;
  showRecord: T | undefined;
  hideRecord: T | undefined;
  open: boolean;
  updateOpen: (b: boolean) => void;
  close: () => void;
  clear: () => void;
}

/**
 * 父调用子组件方法，并传值更新状态
 *  - ( 通常用于 Modal 或 Drawer 中 )
 * @param funcRef 任意名称的 useShow 的实例  `( ref 对象 )`
 * @param [ options ]  配置项
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
    onShow(data) {
      const record = (showRecordRef.current = cloneDeep(data));
      setOpen(true);
      //@ts-ignore
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
  }));

  const setParentData = useCallback((data: any) => {
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
