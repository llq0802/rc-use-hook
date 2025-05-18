import { Button, Divider, Flex } from 'antd';
import React, { useEffect, useRef } from 'react';
import useRecorder from '.';
import FrequencyHistogramView from './extensions/histogram-view';

const Demo1 = () => {
  const ref = useRef<HTMLCanvasElement>(null!);
  const waveViewRef = useRef<FrequencyHistogramView>(null!);

  useEffect(() => {
    waveViewRef.current = new FrequencyHistogramView({
      compatibleCanvas: ref.current,
      width: 400,
      height: 100,
    });
  }, []);

  const { isRecording, blobUrl, size, start, stop, cancel } = useRecorder({
    onProcess(pcmData, powerLevel, sampleRate) {
      const int16Data = new Int16Array(pcmData.map((x) => x * 32767));
      // const int16Data = pcmData.map((x) => x * 30000);
      waveViewRef.current?.input(int16Data, powerLevel, sampleRate);
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
            waveViewRef.current?.reset();
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
