import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';

/**
 * 用于将文字剪切到用户的剪切板
 * @param {number} successDuration  复制成功后多久变回初始状态 默认`1000ms`
 * @return {[boolean, (str: string) => void]}  [ boolean, (str: string) => void ]
 */

export default function useClipboard(
  successDuration: number = 1000,
): [boolean, (str: string) => void] {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied && successDuration > 0) {
      const id = setTimeout(() => setIsCopied(false), successDuration);
      return () => clearTimeout(id);
    }
  }, [isCopied, successDuration]);

  const setText = useCallback((str: string) => {
    try {
      const didCopy = copy(str);
      setIsCopied(didCopy);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, []);

  return [isCopied, setText];
}
