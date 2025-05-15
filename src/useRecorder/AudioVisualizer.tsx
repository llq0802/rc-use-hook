import React, { useEffect, useRef } from 'react';

type VisualizationMode = 'waveform' | 'frequency';

interface AudioVisualizerProps {
  audioData: Uint8Array | null;
  width?: number;
  height?: number;
  mode?: VisualizationMode;
  barColor?: string;
  backgroundColor?: string;
  barWidth?: number;
  gap?: number;
  theme?: 'light' | 'dark';
  customDraw?: (
    ctx: CanvasRenderingContext2D,
    audioData: Uint8Array,
    width: number,
    height: number,
    barWidth?: number,
    gap?: number,
  ) => void;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioData,
  width = 500,
  height = 150,
  mode = 'waveform',
  barColor = '#00ffff',
  backgroundColor = '#111',
  barWidth = 3,
  gap = 1,
  theme = 'dark',
  customDraw,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!audioData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const drawWaveform = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = barColor;
      ctx.lineWidth = 2;

      const bufferLength = audioData.length;
      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = audioData[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(drawWaveform);
    };

    const drawFrequencyBars = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const bufferLength = audioData.length;
      const barCount = Math.floor(width / (barWidth + gap));
      const barHeightScale = height / 256;

      for (let i = 0; i < barCount; i++) {
        const value = audioData[i] || 0;
        const barHeight = value * barHeightScale;

        const x = i * (barWidth + gap);
        const y = height - barHeight;

        const gradient = ctx.createLinearGradient(0, 0, 0, barHeight);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, theme === 'dark' ? '#0ff' : '#099');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationFrameId.current = requestAnimationFrame(drawFrequencyBars);
    };

    if (customDraw) {
      animationFrameId.current = requestAnimationFrame(() => {
        customDraw(ctx, audioData, width, height, barWidth, gap);
      });
    } else if (mode === 'waveform') {
      drawWaveform();
    } else if (mode === 'frequency') {
      drawFrequencyBars();
    }

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [
    audioData,
    width,
    height,
    mode,
    barColor,
    backgroundColor,
    barWidth,
    gap,
    theme,
    customDraw,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', maxWidth: `${width}px` }}
    />
  );
};

export default AudioVisualizer;
