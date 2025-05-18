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

  const { isRecording, blobUrl, size, start, stop, cancel } = useRecorder({
    onProcess(pcmData, powerLevel, sampleRate) {
      const int16Data = new Int16Array(pcmData.map((x) => x * 32767));

      waveViewRef.current?.input(int16Data, powerLevel, sampleRate);
    },
  });

  return (
    <div>
      <Flex gap={10}>
        <Button
          disabled={isRecording}
          variant="filled"
          color="primary"
          onClick={() => {
            start();
          }}
        >
          开始录音
        </Button>

        {isRecording && (
          <>
            <Button
              variant="filled"
              onClick={() => {
                cancel();
                waveViewRef.current.reset();
              }}
            >
              取消录音
            </Button>

            <Button
              variant="filled"
              onClick={() => {
                stop();
                waveViewRef.current.reset();
              }}
            >
              停止录音
            </Button>
          </>
        )}
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
          display: isRecording ? 'block' : 'none',
          width: 400,
          height: 100,
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default Demo1;
