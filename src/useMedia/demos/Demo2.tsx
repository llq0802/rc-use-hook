import { useMedia } from 'rc-use-hooks';
import React from 'react';

function Demo1() {
  const matches = useMedia('(orientation: landscape)');
  const orientation = matches ? 'landscape' : 'portrait';
  return <h3>当前{orientation === 'landscape' ? '横屏' : '竖屏'}</h3>;
}

export default Demo1;
