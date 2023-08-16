import { Button } from 'antd';
import { useLockScroll } from 'rc-use-hooks';
import React, { useRef } from 'react';

function Demo2() {
  const ref = useRef<HTMLDivElement>(null);
  const [lock, setLock] = useLockScroll(false, ref);

  return (
    <div
      ref={ref}
      style={{
        height: 300,
        overflow: 'auto',
      }}
    >
      <Button onClick={() => setLock(!lock)}>切换锁定</Button>
      <div style={{ height: 1000 }}>超出的内容</div>
    </div>
  );
}

export default Demo2;
