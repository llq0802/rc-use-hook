import { Button, Space } from 'antd';
import { useConcurrentRequest } from 'rc-use-hooks';
import React from 'react';

const arrFns: ((...args: any[]) => Promise<any>)[] = [];

function mockRequest(a, b) {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(`成功了`);
      } else {
        reject('失败了');
      }
      // resolve(`成功了`);
    }, 2000);
  });
}

for (let i = 0; i < 4; i++) {
  arrFns.push(mockRequest);
}

function Demo1() {
  const {
    data,
    loading,
    run,
    runAsync,
    mutate: seData,
  } = useConcurrentRequest(arrFns, {
    defaultParams: [
      [10, 20], // 第一个异步函数的参数列表
      [30, 40], // 第二个异步函数的参数列表
      // ...后面同理
    ],
    onBefore(params) {
      // console.log('onBefore===');
    },
    onError(e, params) {
      console.log('onError==');
    },
    onSuccess(data, params) {
      console.log('onSuccess===', data);
    },
    onFinally(params, data, e) {
      console.log('onFinally===');
    },
    // 支持其余所有useRequest的配置项
  });

  return (
    <div>
      {loading ? '加载中...' : '加载完成!'}

      <h3>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </h3>

      <Space>
        <Button
          type="primary"
          onClick={() => {
            run([11, 22]);
          }}
        >
          重新请求
        </Button>

        <Button type="primary" onClick={() => seData([11, 22, 33, 44])}>
          突变
        </Button>
      </Space>
    </div>
  );
}

export default Demo1;
