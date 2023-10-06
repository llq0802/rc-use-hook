import { useEffect, useRef } from 'react';

type Subscription<T> = (val: T) => void;

export class BusEvent<K, T> {
  private subscriptions = new Map();

  /**
   * 发布状态
   * @param {K} key 唯一的 key 值
   * @param {T} val 发布的数据
   * @memberof BusEvent
   */
  emit = (key: K, val: T) => {
    for (const subscription of this.subscriptions.get(key) || []) {
      subscription(val);
    }
  };

  /**
   * 订阅状态
   * @param {K} key  与 emit 中的第一参数对应, 唯一的 key 值
   * @param {Subscription<T>} callback 订阅的回调函数
   * @memberof BusEvent
   */
  subscription = (key: K, callback: Subscription<T>) => {
    const callbackRef = useRef<Subscription<T>>();
    callbackRef.current = callback;

    useEffect(() => {
      function subscription(val: T) {
        if (callbackRef.current) callbackRef.current(val);
      }
      if (!this.subscriptions.has(key)) {
        this.subscriptions.set(key, new Set());
        const subscriptionSet = this.subscriptions.get(key)!;
        subscriptionSet.add(subscription);
      } else {
        const subscriptionSet = this.subscriptions.get(key)!;
        subscriptionSet.add(subscription);
      }

      return () => {
        this.subscriptions.delete(key);
      };
    }, []);
  };
}

/**
 * 基于发布订阅模式的事件总线
 * @description 多用于兄弟组件 (特别是大屏) 之间的传递数据
 * @return {BusEvent<K, T>}
 */
export default function useBusEvent<K = string, T = any>(): BusEvent<K, T> {
  const ref = useRef<BusEvent<K, T>>();
  if (!ref.current) {
    ref.current = new BusEvent<K, T>();
  }
  return ref.current;
}
