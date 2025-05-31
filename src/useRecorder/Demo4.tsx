import { Button, Divider, Flex } from 'antd';
import { useRecorder } from 'rc-use-hooks';
import React, { useEffect, useRef } from 'react';

const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const ctxRef = useRef<CanvasRenderingContext2D>(null!);

  const { start, stop, cancel, isRecording, audioData } = useRecorder();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    ctxRef.current = ctx;
    const width = canvas.width * devicePixelRatio;
    const height = canvas.height * devicePixelRatio;
    canvas.width = width;
    canvas.height = height;
  }, []);

  useEffect(() => {
    if (!audioData?.length) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
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

    // 绘制波形

    ctx.beginPath();
    // 减少采样点，每3个点取一个
    const skipPoints = 2;
    const effectiveLength = Math.floor(audioData.length / skipPoints);
    const sliceWidth = canvas.width / (effectiveLength - 1);
    let x = 0;
    let prevY = ((audioData[0] + 1) * canvas.height) / 2;

    ctx.moveTo(x, prevY);

    for (let i = skipPoints; i < audioData.length - 2; i += skipPoints) {
      const currentY = ((audioData[i] + 1) * canvas.height) / 2;
      const nextY = ((audioData[i + skipPoints] + 1) * canvas.height) / 2;

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

    // 增加线条宽度
    ctx.lineWidth = 3;
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
      <Flex gap={16}>
        <Button onClick={isRecording ? stop : start}>
          {isRecording ? '停止' : '开始'}录音
        </Button>
        <Button
          onClick={() => {
            cancel();
            ctxRef.current.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );
          }}
        >
          取消录音
        </Button>
      </Flex>
      <Divider></Divider>
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        style={{
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default AudioVisualizer;
