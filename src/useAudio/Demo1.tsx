import { Button, Space } from 'antd';
import { useAudio } from 'rc-use-hooks';
import React from 'react';

const isDev = process.env.NODE_ENV === 'development';

const publicPath = !isDev ? `/rc-use-hook/` : '/';

const Demo1 = () => {
  const { play, pause, stop, isPlaying } = useAudio(`${publicPath}test.mp3`, {
    onPlay: () => console.log('Audio is playing'),
    onPause: () => console.log('Audio is paused'),
    onStop: () => console.log('Audio is stopped'),
    onEnd: () => console.log('Audio has ended'),
  });

  return (
    <>
      <Space>
        <Button disabled={isPlaying} onClick={() => play()}>
          Play
        </Button>
        <Button onClick={() => pause()}>Pause</Button>
        <Button onClick={() => stop()}>Stop</Button>
      </Space>
      <p>Is Playing: {isPlaying ? 'Yes' : 'No'}</p>
    </>
  );
};

export default Demo1;
