import { useEffect } from 'react';

/**
 * 关闭页面时 , 提示用户
 * @param enabled {boolean} 是否开启
 * @param message {string} 自定义退出信息 部分浏览器不能改变
 */
const useBeforeUnload = (enabled: boolean = true, message?: string) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (event: BeforeUnloadEvent) => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      if (message) {
        // Chrome requires returnValue to be set.
        event.returnValue = message;
      }
      return message;
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [message, enabled]);
};

export default useBeforeUnload;
