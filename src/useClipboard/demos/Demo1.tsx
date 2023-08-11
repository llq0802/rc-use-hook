import { Button, Input } from 'antd';
import { useClipboard } from 'rc-use-hook';
import React from 'react';

export default function () {
  const [isCopied, setCopied] = useClipboard(1000);

  return (
    <>
      <Button
        onClick={() => {
          setCopied('这是被复制的文本!');
        }}
      >
        点我复制: {isCopied ? '成功 👍' : ' 👎'}
      </Button>
      <br />
      <br />
      <Input />
    </>
  );
}
