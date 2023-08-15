import { useDeviceOrientation } from 'rc-use-hook';
import React from 'react';

function Demo1() {
  const ret = useDeviceOrientation();
  return <h3>当前{ret === 'landscape' ? '横屏' : '竖屏'}</h3>;
}

export default Demo1;
