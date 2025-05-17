import { Button } from 'antd';
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

    // 创建渐变色
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff0099');
    gradient.addColorStop(0.5, '#00ff00');
    gradient.addColorStop(1, '#00ffff');

    // 设置绘制样式
    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient;

    // 添加阴影效果
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff00';

    // 使用 bezierCurveTo 实现平滑曲线
    ctx.beginPath();
    const sliceWidth = canvas.width / (audioData.length - 1);
    let x = 0;
    let prevY = ((audioData[0] + 1) * canvas.height) / 2;

    ctx.moveTo(x, prevY);

    for (let i = 1; i < audioData.length - 2; i++) {
      const currentY = ((audioData[i] + 1) * canvas.height) / 2;
      const nextY = ((audioData[i + 1] + 1) * canvas.height) / 2;

      // 控制点
      const cp1x = x + sliceWidth / 2;
      const cp1y = prevY;
      const cp2x = x + sliceWidth / 2;
      const cp2y = currentY;

      // 绘制贝塞尔曲线
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x + sliceWidth, currentY);

      x += sliceWidth;
      prevY = currentY;
    }

    // 绘制波形
    ctx.stroke();

    // 添加镜像效果
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.scale(1, -1);
    ctx.translate(0, -canvas.height);
    ctx.stroke();
    ctx.restore();
  }, [audioData]);

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
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default AudioVisualizer;
