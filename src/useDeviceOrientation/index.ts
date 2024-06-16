// import { useEffect, useState } from 'react';
import { useMedia } from 'rc-use-hooks';

// const useDeviceOrientation = () => {
//   const [orientation, setOrientation] = useState({
//     alpha: null,
//     beta: null,
//     gamma: null,
//     absolute: false,
//   });

//   useEffect(() => {
//     const handle = (e) => {
//       setOrientation({
//         beta: e.beta,
//         alpha: e.alpha,
//         gamma: e.gamma,
//         absolute: e.absolute,
//       });
//     };
//     window.addEventListener('deviceorientation', handle);

//     return () => {
//       window.removeEventListener('deviceorientation', handle);
//     };
//   }, []);

//   return orientation;
// };

// export default useDeviceOrientation;

export type ScreenOrientation = 'portrait' | 'landscape';
/**
 * 使用CSS3的'orientation' media-query来检查屏幕方向 并对Safari做了降级处理
 * @return 'portrait' | 'landscape'  `portrait` 为竖屏, `landscape`为横屏
 */
export default function useDeviceOrientation(): ScreenOrientation | undefined {
  const matches = useMedia('(orientation: portrait)');

  // const [orientation, setOrientation] = useState<ScreenOrientation>();
  // useEffect(() => {
  //   if (isSafari()) {
  //     const handle = (e) => {
  //       console.log('isSafari()', isSafari());

  //       setOrientation(getScreenOrientation());
  //     };
  //     // window.addEventListener('orientationchange ', handle);

  //     window.onorientationchange = function () {
  //       console.log('getScreenOrientation()', getScreenOrientation());

  //       setOrientation(getScreenOrientation());
  //     };

  //     return () => {
  //       // window.onorientationchange = null;
  //       // window.removeEventListener('orientationchange', handle);
  //     };
  //   }
  // }, []);
  // if (isSafari()) {
  //   return orientation;
  // } else {
  //   return matches === undefined
  //     ? undefined
  //     : matches
  //     ? 'portrait'
  //     : 'landscape';
  // }

  return matches === undefined ? undefined : matches ? 'portrait' : 'landscape';
}
