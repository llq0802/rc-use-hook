import React, { useRef } from 'react';

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

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', maxWidth: `${width}px` }}
    />
  );
};

export default AudioVisualizer;
