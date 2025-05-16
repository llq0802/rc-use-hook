import { useCountDown } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

export type UseRecorderOptions = {
  timeout?: number;
  fftSize?: number;
  /**
   *  'mp3' | 'ogg' | 'webm' | 'wav' | 'aac
   */
  audioType?: 'mp3' | 'ogg' | 'webm' | 'wav' | string;
  /**
   * @example
   *  {
   *     autoGainControl: false, // 关闭自动增益控制
   *     channelCount: 2, // 设置音频通道数
   *     echoCancellation: false, // 关闭回声消除
   *     noiseSuppression: true, // 开启噪音抑制
   *     sampleRate: 44100, // 设置音频采样率 48000
   *     sampleSize: 16, // 设置音频样本大小
   *   }
   *
   */
  audioOptions?: true | MediaTrackConstraints;
  onStart?: () => void;
  onEnd?: (blob: Blob, ...args: any[]) => void;
  onProcess?: (
    pcmData: number[],
    powerLevel: number,
    sampleRate: number,
  ) => void;
  onTimeOut?: () => void;
  onError?: (err: any) => void;
};

export type UseRecorderReturn = {
  isOpening: boolean;
  isRecording: boolean;
  error: string | null;
  blobUrl: string | null;
  base64Url: string | null;
  size: number | null;
  countdown: number;
  start: () => void;
  cancel: () => void;
  stop: () => void;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
};

/**
 * 要求运行在 HTTPS 或 localhost 环境下，并且用户需授予麦克风权限。
 */
const useRecorder = (opts: UseRecorderOptions = {}): UseRecorderReturn => {
  const {
    audioType = 'wav',
    audioOptions = true,
    timeout = 60 * 60,
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const [targetDate, setTargetDate] = useState<number>(0);
  const [countdown] = useCountDown({
    targetDate,
    onEnd() {
      console.warn('===超过录制时长限制，强制结束===');
      stop?.();
      onTimeOut?.();
    },
  });

  const start = async () => {
    try {
      setIsOpening(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioOptions,
      });

      const audioContext = new window.AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      // 可配置 fftSize，默认 2048
      analyser.fftSize = opts.fftSize ?? 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);
      // 存储引用
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async (...args) => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: `audio/${audioType}`,
        });
        setBlobUrl(URL.createObjectURL(audioBlob));
        setSize(audioBlob.size);
        onEnd?.(audioBlob, ...args);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64DataUrl = `data:audio/${audioType};base64,${
            base64String.split(',')[1]
          }`;
          setBase64Url(base64DataUrl);
        };
        reader.readAsDataURL(audioBlob);
      };
      onStart?.();
      setIsOpening(false);
      setIsRecording(true);
      setTargetDate(Date.now() + timeout * 1000);
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error(err);
      setError('无法访问麦克风：' + (err as Error).message);
      onError?.(err);
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;

    setTargetDate(0);
    setIsRecording(false);
  };

  const cancel = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;

    setTargetDate(0);
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
    size,
    start,
    cancel,
    stop,
    analyser: analyserRef.current,
    dataArray: dataArrayRef.current,
  };
};

export default useRecorder;
