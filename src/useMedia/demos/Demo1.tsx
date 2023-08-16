import { useMedia } from 'rc-use-hooks';
import React from 'react';

function Demo1() {
  const isMatch = useMedia('(min-width: 1200px)');

  console.log('isMatch', isMatch);

  return (
    <>
      <h3>缩放窗口试试!</h3>
      <h3>{isMatch ? '视口宽度 >= 1200px' : '视口宽度 < 1200px'}</h3>
    </>
  );
}

export default Demo1;
