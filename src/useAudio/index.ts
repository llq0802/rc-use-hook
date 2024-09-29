import { useMemoizedFn } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

type AudioHook = {
  play: (aSrc?: string) => void;
  pause: () => void;
  stop: (cb?: () => any) => void;
  isPlaying: boolean;
};

/**
 * 管理音频播放hook
 */

export const useAudio = (src?: string): AudioHook => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);

      // 监听播放结束事件
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }

    // 清理函数，通常不需要做太多，因为HTMLAudioElement会自动管理资源
    return () => {
      if (audioRef.current) {
        audioRef.current?.pause();
        audioRef.current.currentTime = 0;
        window.URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [src]); // 依赖项数组中包括src，以确保在src变化时重新加载音频

  const play = useMemoizedFn((aSrc?: string) => {
    if (audioRef.current) {
      if (aSrc) {
        audioRef.current.src = aSrc;
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
  });

  const pause = useMemoizedFn(() => {
    if (audioRef.current && audioRef.current.paused === false) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  });

  const stop = useMemoizedFn((cb) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // 重置音频到开始
      window.URL.revokeObjectURL(audioRef.current.src);
      setIsPlaying(false);
      if (cb) {
        cb();
      }
    }
  });

  return { play, pause, stop, isPlaying };
};
