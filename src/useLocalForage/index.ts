import { useMemoizedFn } from 'ahooks';
import localForage from 'localforage';
import { isNil } from 'lodash-es';
import { useEffect, useState } from 'react';

function useLocalForage<T>(
  key: string,
  initialValue?: T,
): [T | undefined, (value?: T) => void, () => void] {
  const [value, setValue] = useState<T | undefined>(() => initialValue);

  const removeValueFromStorage = useMemoizedFn(async () => {
    try {
      await localForage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error('Failed to remove item from localForage:', error);
    }
  });

  const setValueInStorage = useMemoizedFn(async (newValue: T | undefined) => {
    try {
      if (isNil(newValue)) {
        removeValueFromStorage();
        return;
      }
      await localForage.setItem(key, newValue);
      setValue(newValue);
    } catch (error) {
      console.error('Failed to set item in localForage:', error);
    }
  });

  useEffect(() => {
    const fetchInitialValue = async () => {
      try {
        const storedValue = await localForage.getItem<T>(key);
        if (!isNil(storedValue)) {
          setValue(storedValue);
        } else {
          setValue(initialValue);
        }
      } catch (error) {
        console.error('Failed to get item in localForage:', error);
      }
    };

    fetchInitialValue();
  }, []);

  return [value, setValueInStorage, removeValueFromStorage];
}

export default useLocalForage;
