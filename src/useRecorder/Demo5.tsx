import { Button } from 'antd';
import React, { useEffect } from 'react';
import useRecorder from './index2';

const AudioRecorderWithVisualizer = () => {
  const { isRecording, start, stop, initWaveView, canvasRef } = useRecorder();

  useEffect(() => {
    if (canvasRef.current) {
      initWaveView(canvasRef.current);
    }
  }, []);

  return (
    <div>
      <Button onClick={isRecording ? stop : start}>
        {isRecording ? '停止' : '开始'}录音
      </Button>
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        style={{
          width: '400px',
          height: '100px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>
  );
};

export default AudioRecorderWithVisualizer;
