import { Button } from 'antd';
import { useLockScroll } from 'rc-use-hook';
import React from 'react';

function Demo1() {
  const [lock, setLock] = useLockScroll();
  return (
    <div>
      <p>{lock ? '锁定了' : '没有锁定'}</p>

      <Button type="primary" onClick={() => setLock(!lock)}>
        切换锁定的状态
      </Button>
    </div>
  );
}

export default Demo1;
