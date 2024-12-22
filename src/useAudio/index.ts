import { useMemoizedFn } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

export type UseAudioReturn = {
  play: (aSrc?: string) => void;
  pause: () => void;
  stop: (cb?: () => any) => void;
  isPlaying: boolean;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
};

export type UseAudioOptions = {
  onPlay?: (value: any) => void;
  onPlaying?: (e: any) => void;
  onPause?: () => void;
  onStop?: () => void;
  onEnd?: (e: any) => void;
};

const isBlobUrl = (url: string) => url.startsWith('blob:');

/**
 * 音频钩子函数，用于管理音频的播放状态和操作
 * @param src 音频文件的URL， 建议使用 `blob url`
 * @param opts 配置选项，包括播放、暂停、停止时的回调函数等
 * @returns 返回包含播放、暂停、停止方法和播放状态的音频钩子对象
 */
const useAudio = (src: string, opts: UseAudioOptions = {}): UseAudioReturn => {
  // 管理音频的播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  // 用于存储音频元素的引用
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * 播放音频的方法
   * 如果音频元素不存在，则不执行任何操作
   * 尝试播放音频，并在成功播放后更新状态和调用回调函数
   * 如果播放失败，则在控制台输出错误信息
   */
  const play = useMemoizedFn(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then((value) => {
        setIsPlaying(true);
        opts?.onPlay?.(value);
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
      });
  });

  /**
   * 暂停音频的方法
   * 如果音频元素存在且未暂停，则暂停音频并更新状态和调用回调函数
   */
  const pause = useMemoizedFn(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
      opts?.onPause?.();
    }
  });

  /**
   * 停止音频的方法
   * 如果音频元素不存在，则不执行任何操作
   * 停止音频播放，重置音频到开始，并更新状态和调用回调函数
   */
  const stop = useMemoizedFn(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // 重置音频到开始
    if (isBlobUrl(audioRef.current.src))
      URL.revokeObjectURL(audioRef.current.src);
    setIsPlaying(false);
    opts?.onStop?.();
  });

  /**
   * 处理音频播放中的事件的方法
   * 调用配置选项中的播放中回调函数
   */
  const handlePlaying = useMemoizedFn((e) => {
    opts?.onPlaying?.(e);
  });

  /**
   * 处理音频播放结束事件的方法
   * 更新播放状态为false，并调用配置选项中的播放结束回调函数
   */
  const handleEnded = useMemoizedFn((e) => {
    setIsPlaying(false);
    opts?.onEnd?.(e);
  });

  // 监听音频元素的播放状态变化
  useEffect(() => {
    if (!src) return;
    audioRef.current = new Audio(src);
    // 监听播放中的事件
    audioRef.current.addEventListener('playing', handlePlaying);
    // 监听播放结束事件
    audioRef.current.addEventListener('ended', handleEnded);

    // 清理函数，用于移除事件监听器和释放资源
    return () => {
      if (audioRef.current) {
        audioRef.current?.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.removeEventListener('playing', handlePlaying);
        audioRef.current.removeEventListener('ended', handleEnded);
        if (isBlobUrl(audioRef.current.src))
          URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
    };
  }, [src]);

  return { play, pause, stop, isPlaying, audioRef };
};

export default useAudio;
