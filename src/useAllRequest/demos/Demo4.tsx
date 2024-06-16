import { useRequest } from 'ahooks';
import { Button, Space } from 'antd';
import React from 'react';

function mockRequest() {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(new Date().getTime());
    }, 1000);
  });
}

const arrFns = async () => {
  const p = new Array(5).fill(0).map(mockRequest);
  // return Promise.allSettled(p);
  return Promise.all(p);
};

function Demo1() {
  const { data, loading, run } = useRequest(arrFns);
  return (
    <div>
      <h3>{loading ? '加载中...' : '加载完成!'}</h3>
      <h3>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </h3>
      <Space>
        <Button type="primary" onClick={run}>
          重新请求
        </Button>
      </Space>
    </div>
  );
}

export default Demo1;
