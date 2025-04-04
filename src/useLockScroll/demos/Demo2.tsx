import { Button } from 'antd';
import { useLockScroll } from 'rc-use-hooks';
import React, { useRef } from 'react';

function Demo2() {
  const ref = useRef<HTMLDivElement>(null);
  const [lock, setLock] = useLockScroll(ref);

  return (
    <div
      ref={ref}
      style={{
        height: 300,
        overflow: 'auto',
        border: '1px solid',
      }}
    >
      <Button onClick={() => setLock(!lock)}>切换锁定</Button>
      <div
        style={{
          height: 1000,
          overscrollBehavior: 'contain', //阻止嵌套滚动冒泡 给里面的容器加
        }}
      >
        超出的内容
      </div>
    </div>
  );
}

export default Demo2;
