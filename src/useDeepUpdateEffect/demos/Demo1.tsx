import { Button } from 'antd';
import { useDeepUpdateEffect } from 'rc-use-hook';
import React, { useState } from 'react';

export default () => {
  const [updateEffectCount, setUpdateEffectCount] = useState([0, 1, 2]);
  const [count, setCount] = useState(99);

  useDeepUpdateEffect(() => {
    console.log(' updateEffectCount-执行了');
    setCount((c) => c + 1);
  }, [updateEffectCount]);

  return (
    <div>
      <p>时间戳: {Date.now()}</p>
      <h3>打开控制台查看</h3>
      <p>updateEffectCount: {JSON.stringify(count, null, 4)}</p>
      <p>
        <Button
          type="primary"
          onClick={() => {
            setUpdateEffectCount([...updateEffectCount]);
          }}
        >
          渲染组件
        </Button>
      </p>
    </div>
  );
};
