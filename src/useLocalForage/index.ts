import localForage from 'localforage';
import { useCallback, useEffect, useState } from 'react';

function useLocalForage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(initialValue);

  // 设置值到 localForage 并触发事件
  const setValueInStorage = useCallback(
    async (newValue: T) => {
      try {
        await localForage.setItem(key, newValue);
        setValue(newValue);
      } catch (error) {
        console.error('Failed to set item in localForage:', error);
      }
    },
    [key],
  );

  // 从 localForage 删除值并触发事件
  const removeValueFromStorage = useCallback(async () => {
    try {
      await localForage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error('Failed to remove item from localForage:', error);
    }
  }, [key, initialValue]);

  // 初始化时从 localForage 获取值
  useEffect(() => {
    const fetchInitialValue = async () => {
      const storedValue = await localForage.getItem<T>(key);
      if (storedValue !== null) {
        setValue(storedValue);
      } else {
        setValue(initialValue);
      }
    };

    fetchInitialValue();
  }, [key, initialValue]);

  return [value, setValueInStorage, removeValueFromStorage];
}

export default useLocalForage;
