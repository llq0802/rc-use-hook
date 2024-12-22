import { Checkbox, Form, Input, message, Modal } from 'antd';
import type { UseShowInstanceRef } from 'rc-use-hooks';
import { useShow } from 'rc-use-hooks';
import React from 'react';

type ChildModelProps = {
  modalRef: UseShowInstanceRef;
  [key: string]: any;
};

/**
 * 子组件
 */
export default function ChildModel({ modalRef }: ChildModelProps) {
  const {
    showRecord,
    hideRecord,
    setParentData,
    open,
    updateOpen,
    clear,
    close,
  } = useShow(modalRef, {
    onShow: (data) => {
      message.info(
        `父组件调用了onShow并传参数${JSON.stringify(data, null, 2)}`,
      );
      console.log('父组件调用了onShow并传参数 ', data);
    },
    onHide: (data) => {
      message.info(
        `父组件调用了onHide并传参数${JSON.stringify(data, null, 2)}`,
      );

      console.log('父组件调用了onHide并传参数 ', data);
      clear();
    },
  });

  const handleOk = () => {
    setParentData({
      title: '我是子组件数据',
      value: 99,
    });
    close();
  };

  const handleCancel = () => {
    setParentData(null);
    close();
  };

  return (
    <Modal
      destroyOnClose
      open={open}
      title="这是子组件的弹窗"
      onOk={handleOk}
      onCancel={handleCancel}
      okText="点我向父组件传数据"
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
        initialValues={showRecord}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="age"
          name="age"
          rules={[{ required: true, message: 'Please input your age!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 4, span: 19 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 19 }}>
          <span>父组件调用 onShow 传过来的值: </span>
          <pre>{JSON.stringify(showRecord, null, 4)}</pre>
        </Form.Item>
      </Form>
    </Modal>
  );
}
