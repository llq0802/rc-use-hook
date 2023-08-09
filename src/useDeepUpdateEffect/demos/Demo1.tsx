import { Button } from 'antd';
import { useDeepUpdateEffect } from 'rc-use-hook';
import React, { useState } from 'react';

export default () => {
  const [updateEffectCount, setUpdateEffectCount] = useState([0, 1, 2]);

  useDeepUpdateEffect(() => {
    console.log(' updateEffectCount-执行了');
  }, [updateEffectCount]);

  return (
    <div>
      <p>打开控制台查看执行</p>
      <p>updateEffectCount: {JSON.stringify(updateEffectCount, null, 2)}</p>
      <p>
        <Button
          type="primary"
          onClick={() => {
            setUpdateEffectCount([1, 2, 3]);
          }}
        >
          渲染组件
        </Button>
      </p>
    </div>
  );
};
