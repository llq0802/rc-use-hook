import { Button, message, Space } from 'antd';
import type { UseShowInstance } from 'rc-use-hooks';
import React, { useRef } from 'react';
import ChildModel from './ChildModel';

/**
 * 父组件
 */
export default function Parent() {
  const modalRef = useRef<UseShowInstance>();

  const handleClickShow = () => {
    modalRef.current?.onShow({
      name: '李岚清',
      age: 25,
      remember: true,
    });
  };
  const handleClickHide = () => {
    modalRef.current?.onHide({
      name: '吴彦祖',
      age: 18,
      remember: false,
    });
  };

  const handleGetData = () => {
    const childData = modalRef.current?.getChildData();
    message.info(`获得到子组件数据为:   ${JSON.stringify(childData, null, 2)}`);
  };

  return (
    <div style={{ border: '1px solid #888', padding: 20 }}>
      <h2>这是父组件</h2>
      <Space direction="vertical" size={16}>
        <Button onClick={handleClickShow} type="primary">
          父组件调用onShow事件并传参数给子组件
        </Button>
        <Button onClick={handleClickHide}>
          父组件调用onHide事件并传参数给子组件
        </Button>
        <Button onClick={handleGetData}> 父组件获取子组件数据</Button>
      </Space>

      <ChildModel modalRef={modalRef} />
    </div>
  );
}
