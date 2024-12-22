import { Button, Input } from 'antd';
import { useClipboard } from 'rc-use-hooks';
import React from 'react';

export default function () {
  const [isCopied, setCopied] = useClipboard(2000);

  return (
    <div>
      <Button onClick={() => setCopied('这是被复制的文本!')}>
        点我复制: {isCopied ? '复制成功 👍' : ' 等待复制👎'}
      </Button>
      <br />
      <br />
      <Input placeholder="请输入" />
    </div>
  );
}
