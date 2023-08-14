import { ReactNode, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
/**
 * 允许在父组件之外呈现子组件。
 */
const usePortal = (el: null | HTMLElement = document.body) => {
  const [portal, setPortal] = useState({
    render: () => null,
    remove: () => null,
  });

  const createPortal = useCallback((el) => {
    const Portal = ({ children }) =>
      ReactDOM.createPortal(children, el || document.body);

    const remove = () => ReactDOM.unmountComponentAtNode(el || document.body);

    return { render: Portal, remove };
  }, []);

  useEffect(() => {
    if (el) portal.remove();
    const newPortal = createPortal(el);
    setPortal(newPortal);
    return () => {
      newPortal.remove(el);
    };
  }, [el]);

  return portal.render as ({ children }: { children: ReactNode }) => ReactNode;
};

export default usePortal;
