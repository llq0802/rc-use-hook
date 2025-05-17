import { useEffect, useRef } from 'react';
import WaveView from './wave-view';

export interface UseAudioVisualizerOptions {
  fftSize?: number;
  onProcess?: (
    pcmData: number[],
    powerLevel: number,
    sampleRate: number,
  ) => void;
}

export interface UseAudioVisualizerReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initVisualizer: (stream: MediaStream) => void;
  stopVisualizer: () => void;
}

export const useAudioVisualizer = (
  opts: UseAudioVisualizerOptions = {},
): UseAudioVisualizerReturn => {
  const { fftSize = 2048, onProcess } = opts;

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();
  const waveViewRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const updateAudioData = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      // 计算音量级别
      const sum = dataArrayRef.current.reduce(
        (acc, val) => acc + Math.abs(val - 128),
        0,
      );
      const average = sum / dataArrayRef.current.length;

      // 添加阈值判断
      const threshold = 1;
      const normalizedData =
        average < threshold
          ? new Array(dataArrayRef.current.length).fill(0)
          : Array.from(dataArrayRef.current).map((value) => value / 128.0 - 1);

      // 计算音量级别
      const powerLevel =
        Math.sqrt(
          normalizedData.reduce((acc, val) => acc + val * val, 0) /
            normalizedData.length,
        ) * 100;

      // 更新波形显示
      if (waveViewRef.current) {
        waveViewRef.current.input(
          normalizedData,
          powerLevel,
          audioContextRef.current?.sampleRate || 44100,
        );
      }

      // 如果提供了 onProcess 回调
      onProcess?.(
        normalizedData,
        powerLevel,
        audioContextRef.current?.sampleRate || 44100,
      );

      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    }
  };

  const initVisualizer = (stream: MediaStream) => {
    if (!canvasRef.current) return;

    // 初始化 WaveView
    if (!waveViewRef.current) {
      waveViewRef.current = new WaveView({
        compatibleCanvas: canvasRef.current,
        width: canvasRef.current.width || 400,
        height: canvasRef.current.height || 100,
        scale: 2,
        speed: 9,
        phase: 21.8,
        lineWidth: 2,
        keep: true,
      });
    }

    // 初始化音频分析器
    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    // 开始音频数据更新循环
    animationFrameRef.current = requestAnimationFrame(updateAudioData);
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // 重置波形显示
    if (waveViewRef.current) {
      const emptyData = new Array(1024).fill(0);
      waveViewRef.current.input(
        emptyData,
        0,
        audioContextRef.current?.sampleRate || 44100,
      );
    }

    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopVisualizer();
    };
  }, []);

  return {
    canvasRef,
    initVisualizer,
    stopVisualizer,
  };
};
