// import { useEffect, useRef, useState } from 'react';

// interface UseRecorderProps {
//   timeSlice?: number; // 录音采样时间间隔（毫秒）
// }

// audio: {
//   // deviceId: '指定的设备ID', // 指定特定的音频输入设备
//   autoGainControl: false, // 关闭自动增益控制
//   channelCount: 2, // 设置音频通道数
//   echoCancellation: false, // 关闭回声消除
//   noiseSuppression: true, // 开启噪音抑制
//   sampleRate: 44100, // 设置音频采样率 48000
//   sampleSize: 16, // 设置音频样本大小
// },
// // 注意：此 Hook 要求运行在 HTTPS 或 localhost 环境下，并且用户需授予麦克风权限。

// const useRecorder = ({ timeSlice = 1000 }: UseRecorderProps = {}) => {
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [audioURL, setAudioURL] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   // 检查浏览器是否支持 MediaRecorder API
//   useEffect(() => {
//     if (!navigator.mediaDevices || !MediaRecorder) {
//       setError('当前浏览器不支持录音功能');
//     }
//   }, []);

//   // 开始录音
//   const start = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: 'audio/webm',
//         });
//         const url = URL.createObjectURL(audioBlob);
//         setAudioURL(url);
//       };

//       mediaRecorder.start(timeSlice); // 使用 timeSlice 分段收集数据
//       setIsRecording(true);
//     } catch (err) {
//       setError('无法开始录音，请检查麦克风权限');
//       console.error(err);
//     }
//   };

//   // 停止录音
//   const stop = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // 清除音频 URL
//   const clearAudioURL = () => {
//     if (audioURL) {
//       URL.revokeObjectURL(audioURL);
//       setAudioURL(null);
//     }
//   };

//   // 卸载时清理资源
//   useEffect(() => {
//     return () => {
//       if (mediaRecorderRef.current) {
//         mediaRecorderRef.current.stream
//           .getTracks()
//           .forEach((track) => track.stop());
//       }
//       clearAudioURL();
//     };
//   }, []);

//   return {
//     isRecording,
//     audioURL,
//     error,
//     start,
//     stop,
//     clearAudioURL,
//   };
// };

// export default useRecorder;

import { useCountDown } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

type UseRecorderOptions = {
  timeout?: number;
  audioType?: string;
  audioOptions?: true | MediaTrackConstraints;
  onStart?: () => void;
  onEnd?: (...args: any[]) => void;
  onProcess?: (
    pcmData: number[],
    powerLevel: number,
    sampleRate: number,
  ) => void;

  onTimeOut: () => void;
};

type UseRecorderReturn = {
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
};

const useRecorder = ({
  audioType = 'wav',
  audioOptions = true,
  timeout = 60 * 60,
  onStart,
  onProcess,
  onEnd,
  onTimeOut,
}: UseRecorderOptions): UseRecorderReturn => {
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
  const animationFrameRef = useRef<number | null>(null);
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

  const renderFrame = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
    const pcmData = Array.from(dataArrayRef.current).map(
      (byte) => byte / 128 - 1,
    ); // [-1, 1]
    const powerLevel =
      pcmData.reduce((sum, val) => sum + Math.abs(val), 0) / pcmData.length;
    const sampleRate = audioContextRef?.current?.sampleRate || 0;
    //  const powerLevel = Math.max(...dataArray.map(Math.abs)); // 简单计算功率水平
    onProcess?.(pcmData, powerLevel, sampleRate);
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  };

  const start = async () => {
    try {
      setIsOpening(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioOptions,
      });
      const audioContext = new (window.AudioContext ||
        //@ts-ignore
        window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async (...args) => {
        onEnd?.(...args);
        // 可以选择其他格式如 'audio/ogg'
        const audioBlob = new Blob(audioChunksRef.current, {
          type: `audio/${audioType}`,
        });
        setBlobUrl(URL.createObjectURL(audioBlob));
        setSize(audioBlob.size);
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

      setIsOpening(false);
      setIsRecording(true);
      setTargetDate(Date.now() + timeout * 1000);
      onStart?.();
      animationFrameRef.current = requestAnimationFrame(renderFrame);
      mediaRecorder.start();
    } catch (err) {
      setError('无法访问麦克风：' + (err as Error).message);
      console.error(err);
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setTargetDate(0);
    setIsRecording(false);
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  const cancel = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setTargetDate(0);
    setIsRecording(false);
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  useEffect(() => {
    return () => {
      stop();
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
  };
};

export default useRecorder;
