import React, { useEffect, useRef } from 'react';
import useRecorder from '.';

const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { start, stop, isRecording, audioData } = useRecorder();

  useEffect(() => {
    if (!canvasRef.current || !audioData?.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置绘制样式
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();

    // 计算每个点的位置
    const sliceWidth = canvas.width / audioData.length;
    let x = 0;

    audioData.forEach((value, i) => {
      const y = ((value + 1) * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    });

    ctx.stroke();
  }, [audioData]);

  return (
    <div>
      <button onClick={isRecording ? stop : start}>
        {isRecording ? '停止' : '开始'}录音
      </button>
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default AudioVisualizer;
