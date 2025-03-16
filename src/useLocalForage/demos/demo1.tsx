import { Button, Input } from 'antd';
import { useLocalForage } from 'rc-use-hooks';
import React from 'react';

const LocalForageDemo: React.FC = () => {
  // 使用钩子，初始值为字符串 "Hello World"
  const [message, setMessage, removeMessage] = useLocalForage(
    'demo-key',
    '你好',
  );

  return (
    <div>
      <h1>LocalForage Demo</h1>

      <div>
        <p>当前值: {message}</p>

        <Input
          placeholder="输入新值"
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue) {
              setMessage(newValue);
            } else {
              setMessage();
            }
          }}
        />

        <Button onClick={() => removeMessage()}>清除值</Button>
      </div>
    </div>
  );
};

export default LocalForageDemo;
