import { Button, Flex } from 'antd';
import React from 'react';
import useRecorder from '.';

const AudioRecorderWithVisualizer = () => {
  const { isRecording, blobUrl, size, error, start, stop, cancel } =
    useRecorder({
      onEnd(...args) {
        console.log('onEnd', ...args);
      },
    });

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Flex gap={10}>
        <Button
          variant="filled"
          color="primary"
          onClick={() => {
            isRecording ? stop() : start();
          }}
        >
          {isRecording ? '停止录音' : '开始录音'}
        </Button>

        <Button
          variant="filled"
          onClick={() => {
            cancel();
          }}
        >
          cancel
        </Button>
      </Flex>

      {blobUrl && (
        <div>
          <p>录音文件：</p>
          <audio src={blobUrl} controls />
          <p>{(size || 0) / 1024} kb</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderWithVisualizer;
