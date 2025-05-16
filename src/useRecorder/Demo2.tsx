import { Button, Divider, Flex } from 'antd';
import React, { useRef } from 'react';
import useRecorder from './index1';

const Demo2 = () => {
  const ref = useRef();
  const { isRecording, start, stop } = useRecorder(ref.current);

  return (
    <div>
      <Flex gap={16}>
        <Button
          variant="filled"
          color="primary"
          onClick={() => {
            isRecording ? stop() : start();
          }}
        >
          {isRecording ? '停止录音' : '开始录音'}
        </Button>
      </Flex>
      <Divider />

      <canvas
        ref={ref}
        style={{
          width: 400,
          height: 100,
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default Demo2;
