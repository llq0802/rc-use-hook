import { useBeforeUnload } from 'rc-use-hook';
import React from 'react';

const Demo1 = () => {
  useBeforeUnload();

  return <p>关闭页面试试</p>;
};

export default Demo1;
