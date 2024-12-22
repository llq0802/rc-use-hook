import { usePageLeave } from 'rc-use-hooks';
import React from 'react';

const Demo1 = () => {
  const isLeave = usePageLeave();
  return <div>是否离开文档: {JSON.stringify(isLeave, null, 2)}</div>;
};

export default Demo1;
