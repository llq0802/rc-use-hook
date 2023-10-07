import { Button } from 'antd';
import { useDeepMemo } from 'rc-use-hooks';
import React, { useEffect, useState } from 'react';

export default () => {
  const [updateEffectCount, setUpdateEffectCount] = useState([0, 1, 2]);

  const newCout = useDeepMemo(() => {
    return updateEffectCount.map((item) => item * 2);
  }, [updateEffectCount]);

  useEffect(() => {
    console.log('useUpdateEffect 更新了');
  }, [newCout]);

  return (
    <div>
      <p>时间戳: {Date.now()}</p>
      <h3>打开控制台查看</h3>
      <p>
        <Button
          type="primary"
          onClick={() => {
            setUpdateEffectCount([0, 1, 2]);
          }}
        >
          无论怎么更新, 引用地址都不变
        </Button>
        <br />
        <br />
        <Button
          type="primary"
          onClick={() => {
            setUpdateEffectCount([1, 2, 3]);
          }}
        >
          只变一次, 无论怎么更新, 引用地址都不变
        </Button>
      </p>
    </div>
  );
};
