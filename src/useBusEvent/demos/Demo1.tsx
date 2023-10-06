import { Button, Space } from 'antd';
import Mock from 'better-mock';
import { BusEvent, useBusEvent } from 'rc-use-hooks';
import React, { useState } from 'react';

type PropsType = {
  busEvent: BusEvent<string, string>;
};

const Child1 = ({ busEvent }: PropsType) => {
  const [val, setVal] = useState();
  busEvent.subscription('key', (val) => {
    console.log('Child1-key', val);
    setVal(val);
  });

  return <div>我是-Child1: {val}</div>;
};
const Child2 = ({ busEvent }: PropsType) => {
  const [val, setVal] = useState();

  busEvent.subscription('key', (val) => {
    console.log('Child2-key', val);
    setVal(val);
  });
  return <div>我是-Child2: {val}</div>;
};

const Child3 = ({ busEvent }: PropsType) => {
  const [val, setVal] = useState();

  busEvent.subscription('key3', (val) => {
    console.log('Child3-key', val);
    setVal(val);
  });
  return <div>我是-Child3: {val}</div>;
};

export default function Demo1() {
  const busEvent = useBusEvent<string, string>();

  return (
    <div>
      <Space>
        <Button
          onClick={() => {
            busEvent.emit(
              'key',
              `我是传递给 Child1 和 Child2 的数据: ${Mock.Random.ctitle()}`,
            );
          }}
        >
          点击发布给 Child1 和 Child2
        </Button>
        <Button
          onClick={() => {
            busEvent.emit(
              'key3',
              `我是传递给 Child3 的数据: ${Mock.Random.ctitle()}`,
            );
          }}
        >
          点击发布给 Child3
        </Button>
      </Space>
      <br />
      <br />
      <Child1 busEvent={busEvent} />
      <Child2 busEvent={busEvent} />
      <Child3 busEvent={busEvent} />
    </div>
  );
}
