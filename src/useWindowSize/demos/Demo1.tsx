import { useWindowSize } from 'rc-use-hooks';
import React from 'react';

const Demo1 = () => {
  const windowSize = useWindowSize();

  return (
    <>
      <p>缩放窗口试试</p>
      <pre>{JSON.stringify(windowSize, null, 4)}</pre>
    </>
  );
};

export default Demo1;
