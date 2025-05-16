import { Button, Divider, Flex } from 'antd';
import React, { useEffect, useRef } from 'react';
import useRecorder from '.';
import WaveView from './extensions/wave-view';

const AudioRecorderWithVisualizer = () => {
  const ref = useRef<HTMLCanvasElement>(null!);
  const waveViewRef = useRef<WaveView>(null!);

  useEffect(() => {
    waveViewRef.current = new WaveView({
      compatibleCanvas: ref.current,
      width: 400,
      height: 100,
      lineWidth: 2,
      keep: false,
      // phase: 3,
    });
  }, []);

  const { isRecording, blobUrl, size, error, start, stop, cancel } =
    useRecorder({
      onProcess(pcmData, powerLevel, sampleRate) {
        waveViewRef.current?.input(pcmData, powerLevel, sampleRate);
      },
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

export default AudioRecorderWithVisualizer;
