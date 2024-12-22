import { useMedia } from 'rc-use-hooks';
import React from 'react';

function Demo1() {
  const isMatch = useMedia('(min-width: 1200px)');

  return <h3>{isMatch ? '视口宽度 >= 1200px' : '视口宽度 < 1200px'}</h3>;
}

export default Demo1;
