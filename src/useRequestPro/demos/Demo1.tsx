import { Button, Space } from 'antd';
import { useRequestPro } from 'rc-use-hooks';
import React from 'react';
import { mockRequest } from './better-mock';

function Demo1() {
  const {
    hasData,
    previousData,
    initData,
    initLoading,
    noInitLoading,
    data,
    run,
    loading,
    mutate: seData,
  } = useRequestPro(mockRequest, {
    isLockRun: true,
    dataKeyName: 'data',
    // 支持其余所有的 useRequest 的配置项
  });

  return (
    <div>
      <p>
        第一次请求成功的 data 值:<pre>{JSON.stringify(initData, null, 2)}</pre>
      </p>
      <p>
        上一次 data 值:<pre>{JSON.stringify(previousData, null, 2)}</pre>
      </p>
      <h4>
        最新的 data 值: <pre>{JSON.stringify(data, null, 2)}</pre>
      </h4>
      <p>
        loading:<pre>{JSON.stringify(loading, null, 2)}</pre>
      </p>
      <p>
        initLoading:<pre>{JSON.stringify(initLoading, null, 2)}</pre>
      </p>
      <p>
        noInitLoading:<pre>{JSON.stringify(noInitLoading, null, 2)}</pre>
      </p>
      <p>
        hasData:<pre>{JSON.stringify(hasData, null, 2)}</pre>
      </p>

      <Space>
        <Button
          type="primary"
          onClick={() => {
            run();
          }}
        >
          重新请求
        </Button>
      </Space>
    </div>
  );
}

export default Demo1;
