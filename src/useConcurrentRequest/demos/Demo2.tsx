import { Button, Space } from 'antd';
import { useConcurrentRequest } from 'rc-use-hooks';
import React from 'react';

const arrFns: ((...args: any[]) => Promise<any>)[] = [];

function mockRequest() {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(`成功了`);
      } else {
        reject(`失败了`);
      }
    }, 600);
  });
}

for (let i = 0; i < 3; i++) {
  arrFns.push(mockRequest);
}

function Demo2() {
  const { data, loading, run, runAsync } = useConcurrentRequest(arrFns, {
    allSettled: false, //只要有一项异步函数被拒绝则不返回数据
    // manual: true,
    onError(e, params) {
      console.log('Demo2===onError ', e);
    },
    onSuccess(data, params) {
      console.log('Demo2===onSuccess ', data);
    },
  });
  return (
    <div>
      {loading ? '加载中...' : '加载完成!'}

      <h3>{data ? <pre>{JSON.stringify(data, null, 4)}</pre> : '没有数据'}</h3>

      <Space>
        <Button
          type="primary"
          onClick={async () => {
            run([11, 22], [33, 44], [5]);
          }}
        >
          点击请求
        </Button>
      </Space>
    </div>
  );
}

export default Demo2;
