import { Button, Divider, Flex } from 'antd';
import React, { useEffect, useRef } from 'react';
import useRecorder from '.';
import WaveView from './extensions/wave-view';

const Demo1 = () => {
  const ref = useRef<HTMLCanvasElement>(null!);
  const waveViewRef = useRef<WaveView>(null!);

  useEffect(() => {
    waveViewRef.current = new WaveView({
      compatibleCanvas: ref.current,
      width: 400,
      height: 100,
      keep: false,
    });
  }, []);

  const { isRecording, blobUrl, size, duration, start, stop, cancel } =
    useRecorder({
      onProcess(pcmData, powerLevel, sampleRate) {
        waveViewRef.current?.input(pcmData, powerLevel, sampleRate);
      },
    });

  return (
    <div>
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
      <Divider />
      {blobUrl && (
        <div>
          <p>录音文件：</p>
          <audio src={blobUrl} controls />
          <p>{(size || 0) / 1024} kb</p>
        </div>
      )}
      {duration && (
        <div>
          <p>录音时长：{duration} s</p>
        </div>
      )}
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

export default Demo1;
