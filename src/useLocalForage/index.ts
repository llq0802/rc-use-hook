import localForage from 'localforage';
import { useCallback, useEffect, useState } from 'react';

function useLocalForage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T) => Promise<void>, () => Promise<void>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof initialValue === 'function') {
      return (initialValue as () => T)();
    }
    return initialValue;
  });

  // 修正后的handleStorageOperation
  async function handleStorageOperation<R, P extends any[]>(
    operation: (...args: P) => Promise<R>,
    ...args: P
  ): Promise<R> {
    try {
      return await operation(...args);
    } catch (error) {
      console.error('Storage operation failed:', error);
      throw error;
    }
  }

  const setValueInStorage = useCallback(
    async (newValue: T) => {
      await handleStorageOperation(localForage.setItem, key, newValue);
      setValue(newValue);
    },
    [key],
  );

  const removeValueFromStorage = useCallback(async () => {
    await handleStorageOperation(localForage.removeItem, key);
    setValue(
      typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue,
    );
  }, [key, initialValue]);

  useEffect(() => {
    const fetchInitialValue = async () => {
      const storedValue = await localForage.getItem<T>(key);
      setValue(
        storedValue !== null
          ? storedValue
          : typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue,
      );
    };
    fetchInitialValue();
  }, [key]);

  return [value, setValueInStorage, removeValueFromStorage];
}

export default useLocalForage;
