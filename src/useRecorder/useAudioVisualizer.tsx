// useAudioVisualizer.ts
import { useEffect, useRef } from 'react';

interface UseAudioVisualizerOptions {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
}

const useAudioVisualizer = ({
  canvasRef,
  analyser,
  dataArray,
}: UseAudioVisualizerOptions) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const draw = () => {
      if (!analyser || !dataArray || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 动态适配 canvas 尺寸
      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(draw);
    };

    if (analyser && dataArray && canvasRef.current) {
      draw();
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [analyser, dataArray, canvasRef]);
};

export default useAudioVisualizer;
