import { PageLoadEnum, usePageLoadType } from 'rc-use-hooks';
import React from 'react';

export default () => {
  usePageLoadType((type) => {
    if (type === PageLoadEnum.RELOAD) {
      alert('页面刷新了');
    } else if (type === PageLoadEnum.BACK_FORWAR) {
      alert('页面回退了');
    } else if (type === PageLoadEnum.NAVIGATE) {
      alert('页面通过链接正常加载');
    }
  });
  return <div>刷新页面试试</div>;
};
