import { Button, Space } from 'antd';
import { useAllRequest } from 'rc-use-hooks';
import React from 'react';

const arrFns: ((...args: any[]) => Promise<any>)[] = [];

function mockRequest() {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(`成功了`);
    }, 1000);
  });
}

for (let i = 0; i < 8; i++) {
  arrFns.push(mockRequest);
}

function Demo3() {
  const { data, loading, run } = useAllRequest(arrFns, {
    max: 3, //设置最大并发数量
    defaultParams: [[1]],
  });

  return (
    <div>
      {loading ? '加载中...' : '加载完成!'}

      <h3>{data ? <pre>{JSON.stringify(data, null, 4)}</pre> : '没有数据'}</h3>

      <Space>
        <Button type="primary" onClick={() => run([11, 22], [33, 44], [5])}>
          点击请求
        </Button>
      </Space>
    </div>
  );
}

export default Demo3;
