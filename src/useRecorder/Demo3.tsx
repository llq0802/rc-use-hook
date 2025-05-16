import { Button, Divider, Flex } from 'antd';
import React, { useRef } from 'react';

import { message } from 'antd';
import Recorder from 'recorder-core/recorder.wav.min';
import 'recorder-core/src/extensions/waveview';
// import 'recorder-core/src/extensions/frequency.histogram.view';
// import 'recorder-core/src/extensions/lib.fft';

let rec: any;
let wave: any;

const Demo3 = () => {
  const ref = useRef();

  /** 获取录音权限 */
  async function openRecorder(opts = {}) {
    return new Promise((resolve, reject) => {
      try {
        rec = Recorder({
          type: 'wav',
          sampleRate: 8000,
          bitRate: 16,
          audioTrackSet: {
            noiseSuppression: true, //降噪（ANS）开关，不设置时由浏览器控制（一般为默认打开），设为true明确打开，设为false明确关闭
            echoCancellation: true, //回声消除（AEC）开关，取值和降噪开关一样
          },
          onProcess(
            buffers: any[],
            powerLevel: number,
            bufferDuration: any,
            bufferSampleRate: number,
          ) {
            console.log('===buffers==>', buffers);
            wave?.input(
              buffers[buffers.length - 1],
              powerLevel,
              bufferSampleRate,
            ); // 输入音频数据，更新显示波形
          },
          ...opts,
        });
        rec?.open(
          function () {
            resolve(rec);
          },
          function (msg: string, isUserNotAllow: boolean) {
            if (isUserNotAllow) message.error('用户拒绝录音权限，录音失败');
            console.log(
              `${isUserNotAllow ? 'UserNotAllow，' : ''}无法录音:${msg}`,
            );
            reject(msg);
          },
        );
      } catch (e) {
        console.error('授权录音失败:', e);
        reject(e);
      }
    });
  }
  /** 开始录音 */
  async function startRecorder(opts = {}) {
    return new Promise((resolve, reject) => {
      try {
        if (Recorder.WaveView) {
          wave = Recorder.WaveView({
            compatibleCanvas: ref.current,
            width: 400,
            height: 100,
            keep: false,
            ...opts,
          });
        }
        rec?.start();
        resolve(rec);
      } catch (e) {
        console.error('开始录音失败:', e);
        reject(e);
      }
    });
  }
  /** 结束录音 */
  async function stopRecorder(): Promise<Blob | any> {
    return new Promise((resolve, reject) => {
      rec?.stop(
        function (blob: Blob, duration: number) {
          console.log(`时长:${duration}ms`);
          rec?.close();
          resolve?.(blob);
          setTimeout(() => {
            rec = null;
            wave = null;
          });
        },
        function (msg: string) {
          console.log(`结束录音失败:${msg}`);
          rec?.close();
          reject(msg);
          setTimeout(() => {
            rec = null;
            wave = null;
          });
        },
      );
    });
  }
  /** 取消录音 */
  async function closeRecorder() {
    return new Promise<void>((resolve) => {
      rec?.close(resolve);
      setTimeout(() => {
        rec = null;
        wave = null;
      });
    });
  }

  return (
    <div>
      <Flex gap={16}>
        <Button
          variant="filled"
          color="primary"
          onClick={async () => {
            await openRecorder();
            startRecorder();
          }}
        >
          开始录音
        </Button>
        <Button
          variant="filled"
          color="primary"
          onClick={() => {
            stopRecorder();
          }}
        >
          停止录音
        </Button>
      </Flex>
      <Divider />

      <canvas
        ref={ref}
        style={{
          width: 400,
          height: 100,
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default Demo3;
