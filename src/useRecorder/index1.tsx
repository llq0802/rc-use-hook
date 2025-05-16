import { useEffect, useRef, useState } from 'react';
import WaveView from './extensions/wave-view';

function useRecorder(canvasElement) {
  const waveViewRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    if (canvasElement) {
      waveViewRef.current = new WaveView({
        compatibleCanvas: canvasElement,
      });
    }
  }, [canvasElement]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      setIsRecording(true);
      const draw = () => {
        requestAnimationFrame(draw);
        analyser.getFloatTimeDomainData(dataArray);
        const powerLevel = Math.max(...dataArray.map(Math.abs));

        console.log('===dataArray==>', dataArray);

        waveViewRef.current?.input(dataArray, powerLevel, audioCtx.sampleRate);
      };

      draw();
    } catch (err) {
      console.error('无法访问麦克风', err);
    }
  };

  const stop = () => {
    setIsRecording(false);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  return { start, stop, isRecording };
}

export default useRecorder;
