import { Button, Input } from 'antd';
import { useClipboard } from 'rc-use-hook';
import React from 'react';

const textP = '你好你好';

const Demo1 = () => {
  const [text, setText] = useClipboard(textP);

  return (
    <div>
      <Button onClick={() => setText('我是谁?')}>点击复制</Button>

      <br />
      <br />

      <Input placeholder="粘贴到输入框" defaultValue={text} />
    </div>
  );
};

export default Demo1;
