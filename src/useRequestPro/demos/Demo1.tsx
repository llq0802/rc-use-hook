import { Button, Space } from 'antd';
import { useRequestPro } from 'rc-use-hooks';
import React from 'react';

function mockRequest(a) {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: a,
        message: '',
      });
    }, 500);
  });
}

function Demo1() {
  const {
    initData,
    initLoading,
    data,
    run,
    loading,
    mutate: seData,
  } = useRequestPro(mockRequest, {
    defaultParams: [1],
    // dataKeyName: 'data',
  });
  return (
    <div>
      {loading ? '加载中...' : '加载完成!'}

      <h3>
        <pre>{JSON.stringify(initData, null, 4)}</pre>
      </h3>
      <h3>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </h3>

      <Space>
        <Button
          type="primary"
          onClick={() => {
            run(Date.now());
          }}
        >
          重新请求
        </Button>
      </Space>
    </div>
  );
}

export default Demo1;
