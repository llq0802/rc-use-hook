import { ReactNode, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
/**
 * 允许在父组件之外呈现子组件。
 * @param {HTMLElement} el 要挂载到哪个元素下面 默认body
 */
const usePortal = (el: null | HTMLElement = document.body) => {
  const [portal, setPortal] = useState({
    render: () => null,
    remove: () => null,
  });

  const createPortalFn = useCallback((el) => {
    const Portal = ({ children }) =>
      ReactDOM.createPortal(children, el || document.body);

    // React 将从此节点移除已挂载的 React 组件(children)。
    const remove = () =>
      ReactDOM?.unmountComponentAtNode?.(el || document.body);

    return { render: Portal, remove };
  }, []);

  useEffect(() => {
    if (el) portal.remove();
    const newPortal = createPortalFn(el);
    setPortal(newPortal as any);
    return () => {
      newPortal.remove();
    };
  }, [el]);

  return portal.render as ({ children }: { children: ReactNode }) => ReactNode;
};

export default usePortal;
