import { useEffect } from 'react';

/**
 * 关闭页面时 , 提示用户
 * @param enabled {boolean} 是否开启
 * @param message {string} 自定义退出信息 部分浏览器不能改变
 */
const useBeforeUnload = (
  enabled: boolean = true,
  message: string = '真的要离开吗?',
) => {
  useEffect(() => {
    const prevOnbeforeunload = window.onbeforeunload;

    if (!enabled) {
      window.onbeforeunload = prevOnbeforeunload;
      return;
    }

    // const handler = (event: BeforeUnloadEvent) => {
    //   event.preventDefault();
    //   if (message) {
    //     event.returnValue = message;
    //   }
    //   return message;
    // };
    // window.addEventListener('beforeunload', handler);
    // return () => window.removeEventListener('beforeunload', handler);

    window.onbeforeunload = function (event: BeforeUnloadEvent) {
      event.preventDefault();
      if (prevOnbeforeunload) {
        prevOnbeforeunload?.(event);
      }
      event.returnValue = message;
      return message;
    };

    return () => {
      window.onbeforeunload = prevOnbeforeunload;
    };
  }, [message, enabled]);
};

export default useBeforeUnload;
