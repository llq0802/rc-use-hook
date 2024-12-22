import { useMedia } from 'rc-use-hooks';
import React from 'react';

function Demo1() {
  const isDarkMode = useMedia('(prefers-color-scheme: dark)');

  return <h3>当前{isDarkMode ? '暗色主题' : '亮色主题'}</h3>;
}

export default Demo1;
