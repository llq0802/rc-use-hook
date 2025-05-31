import { useCountDown } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

/**
 * 录音 Hook 配置选项接口
 */
export type UseRecorderOptions = {
  /**
   * 可选：录音超时时间（单位：毫秒）。
   *
   * 如果设置了该值，录音会在指定时间后自动停止。
   */
  timeout?: number;

  /**
   * 可选：FFT（快速傅里叶变换）大小。
   *
   * 控制音频频谱分析的精度，默认为 2048。
   */
  fftSize?: number;

  /**
   * 可选：输出音频文件的格式。
   *
   * 支持 'mp3' | 'ogg' | 'webm' | 'wav' | 'aac' 等格式。
   */
  audioType?: 'mp3' | 'ogg' | 'webm' | 'wav' | 'aac' | string;

  /**
   * 可选：音频轨道约束配置。
   *
   * 用于设置音频采集参数，如采样率、通道数等。
   *
   * 示例：
   * ```ts
   * {
   *   autoGainControl: false, // 关闭自动增益控制
   *   channelCount: 2,        // 设置音频通道数
   *   echoCancellation: false, // 关闭回声消除
   *   noiseSuppression: true, // 开启噪音抑制
   *   sampleRate: 44100,      // 设置音频采样率
   *   sampleSize: 16          // 设置音频样本大小
   * }
   * ```
   */
  audioOptions?: true | MediaTrackConstraints;

  /**
   * 可选：录音开始回调函数。
   *
   * 在录音开始时触发。
   */
  onStart?: () => void;

  /**
   * 可选：录音结束回调函数。
   *
   * 在录音结束或手动停止时触发。
   *
   * 参数：
   * - blob: 录音生成的 Blob 对象
   * - duration: 录音持续时间（单位：毫秒）
   */
  onEnd?: (blob: Blob, duration: number, ...args: any[]) => void;

  /**
   * 可选：录音过程回调函数。
   *
   * 每帧音频数据处理时触发，可用于实时可视化或分析。
   *
   *
   * 参数：
   * - pcmData: 当前音频 PCM 数据数组
   * - powerLevel: 当前音频能量等级
   * - sampleRate: 音频采样率
   */
  onProcess?: (
    pcmData: number[],
    powerLevel: number,
    sampleRate: number,
  ) => void;

  /**
   * 可选：录音超时回调函数。
   *
   * 在录音达到指定 `timeout` 时间后触发。
   */
  onTimeOut?: () => void;

  /**
   * 可选：错误回调函数。
   *
   * 在录音过程中发生错误时触发。
   *
   * 参数：
   * - err: 错误对象或字符串
   */
  onError?: (err: any) => void;
};

/**
 * useRecorder 返回值接口
 */
export type UseRecorderReturn = {
  /**
   * 表示是否正在请求麦克风权限或打开设备。
   */
  isOpening: boolean;

  /**
   * 表示当前是否正在录音。
   */
  isRecording: boolean;

  /**
   * 当前错误信息，如果存在的话。
   */
  error: string | null;

  /**
   * 录音生成的 Blob URL 地址，可用于播放录音。
   */
  blobUrl: string | null;

  /**
   * 录音生成的 Base64 URL 地址，可用于下载或传输。
   */
  base64Url: string | null;

  /**
   * 录音文件的大小（字节数）。
   */
  size: number | null;

  /**
   * 倒计时数值，仅在倒计时时有效。
   */
  countdown: number;

  /**
   * 当前录音的持续时间（单位：秒）。
   */
  duration: number;

  /**
   * 开始录音的方法。
   */
  start: () => void;

  /**
   * 取消当前录音的方法。
   */
  cancel: () => void;

  /**
   * 停止录音的方法。
   */
  stop: () => void;

  /**
   * 当前录音的原始音频数据（Uint8Array 转换后的数组）。
   */
  audioData: number[];

  /**
   * 当前使用的媒体流对象（MediaStream）。
   */
  stream: MediaStream | undefined;
};

/**
 * 要求运行在 HTTPS 或 localhost 环境下，并且用户需授予麦克风权限。
 */
const useRecorder = (opts: UseRecorderOptions = {}): UseRecorderReturn => {
  const {
    audioType = 'wav',
    audioOptions = true,
    timeout = 60 * 60,
    fftSize = 2048,
    onStart,
    onProcess,
    onEnd,
    onError,
    onTimeOut,
  } = opts;
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [base64Url, setBase64Url] = useState<string | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [stream, setStream] = useState<MediaStream>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioData, setAudioData] = useState<number[]>([]);
  const animationFrameRef = useRef<number>();
  const [duration, setDuration] = useState<number>(0);
  const durationTimerRef = useRef<NodeJS.Timer>();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const [targetDate, setTargetDate] = useState<number>();
  const [t] = useCountDown({
    targetDate,
    onEnd() {
      console.warn('===超过录制时长限制，强制结束===');
      stop?.();
      onTimeOut?.();
    },
  });
  const countdown = Math.round(t / 1000);

  const updateAudioData = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    const sum = dataArrayRef.current.reduce(
      (acc, val) => acc + Math.abs(val - 128),
      0,
    );
    const average = sum / dataArrayRef.current.length;

    // 添加阈值判断，如果音量太小就将所有值设为 128（对应归一化后的 0）
    const threshold = 1; // 可以根据需要调整这个阈值

    const normalizedData =
      average < threshold
        ? new Array(dataArrayRef.current.length).fill(0)
        : Array.from(dataArrayRef.current).map(
            (value) => (value / 128.0 - 1) * 2,
          );

    setAudioData(normalizedData);

    const powerLevel =
      Math.sqrt(
        normalizedData.reduce((acc, val) => acc + val * val, 0) /
          normalizedData.length,
      ) * 100; // 将powerLevel归一化到0-100的范围

    onProcess?.(
      normalizedData,
      powerLevel,
      audioContextRef.current?.sampleRate || 44100,
    );

    animationFrameRef.current = requestAnimationFrame(updateAudioData);
  };

  const start = async () => {
    try {
      setIsOpening(true);
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: audioOptions,
      });
      setStream(audioStream);
      // 初始化内部的音频上下文
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(audioStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      //#region
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async (...args) => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: `audio/${audioType}`,
        });
        setBlobUrl(URL.createObjectURL(audioBlob));
        setSize(audioBlob.size);
        onEnd?.(audioBlob, duration, ...args);

        // 转换为 base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64DataUrl = `data:audio/${audioType};base64,${
            base64String.split(',')[1]
          }`;
          setBase64Url(base64DataUrl);
        };
      };
      //#endregion

      setIsOpening(false);
      setIsRecording(true);

      setTimeout(() => {
        onStart?.();
        setTargetDate(Date.now() + timeout * 1000);
        mediaRecorderRef.current?.start();
        animationFrameRef.current = requestAnimationFrame(updateAudioData);
        // 开始计时
        durationTimerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
      });
    } catch (err) {
      setError('无法访问麦克风：' + (err as Error).message);
      onError?.(err);
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = void 0;
    }
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = void 0;
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;

    setTargetDate(void 0);
    setIsRecording(false);
  };

  const cancel = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = void 0;
    }
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = void 0;
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;

    setTargetDate(void 0);
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  return {
    error,
    isOpening,
    isRecording,
    blobUrl,
    base64Url,
    countdown,
    duration,
    size,
    start,
    cancel,
    stop,
    stream,
    audioData,
  };
};

export default useRecorder;

export * from './extensions';
