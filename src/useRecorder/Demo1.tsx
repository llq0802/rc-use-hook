import React from 'react';
import useRecorder from '.';
import AudioVisualizer from './AudioVisualizer';

const AudioRecorderWithVisualizer = () => {
  const {
    isRecording,
    audioURL,
    error,
    audioData,
    startRecording,
    stopRecording,
  } = useRecorder();

  const customDraw = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number,
  ) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const length = data.length;
    for (let i = 0; i < length; i++) {
      const value = data[i];
      const barHeight = (value / 255) * height;

      const r = value;
      const g = 250 - value;
      const b = 50;

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(i * 4, height - barHeight, 2, barHeight);
    }

    requestAnimationFrame(() => customDraw(ctx, data, width, height));
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? '停止录音' : '开始录音'}
      </button>

      {/* 模式一：波形图 */}
      <h3>波形图</h3>
      <AudioVisualizer
        audioData={audioData}
        mode="waveform"
        width={600}
        height={150}
      />

      {/* 模式二：频谱图 */}
      <h3>频谱图</h3>
      <AudioVisualizer
        audioData={audioData}
        mode="frequency"
        width={600}
        height={150}
        barColor="#FFD700"
        backgroundColor="#000"
        barWidth={4}
        gap={2}
      />

      {/* 模式三：自定义绘制 */}
      <h3>自定义可视化</h3>
      <AudioVisualizer
        audioData={audioData}
        width={600}
        height={150}
        customDraw={customDraw}
      />

      {audioURL && (
        <div>
          <p>录音文件：</p>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
};

export default AudioRecorderWithVisualizer;
