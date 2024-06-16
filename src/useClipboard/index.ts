// import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

// interface ClipboardDataWindow extends Window {
//   clipboardData: DataTransfer | null;
// }

// type ClipboardTuple = [string, (clipboard: string) => void];

// type VoidFunction = () => void;

// const hasClipboardData = (w: Window): w is ClipboardDataWindow =>
//   Object.prototype.hasOwnProperty.call(w, 'clipboardData');

// const getClipboardData = (
//   w: ClipboardDataWindow | Window,
// ): DataTransfer | null => {
//   if (hasClipboardData(w)) {
//     return w.clipboardData;
//   }
//   return null;
// };

// const isClipboardApiEnabled = (navigator: Navigator) =>
//   typeof navigator === 'object' && typeof navigator.clipboard === 'object';

// const NOT_ALLOWED_ERROR = new Error('NotAllowed');

// const zeroStyles = (element: HTMLElement, ...properties: string[]): void => {
//   for (const property of properties) {
//     element.style.setProperty(property, '0');
//   }
// };

// const createTextArea = (): HTMLTextAreaElement => {
//   const textArea: HTMLTextAreaElement = document.createElement('textarea');
//   textArea.setAttribute('cols', '0');
//   textArea.setAttribute('rows', '0');
//   zeroStyles(
//     textArea,
//     'border-width',
//     'bottom',
//     'margin-left',
//     'margin-top',
//     'outline-width',
//     'padding-bottom',
//     'padding-left',
//     'padding-right',
//     'padding-top',
//     'right',
//   );
//   textArea.style.setProperty('box-sizing', 'border-box');
//   textArea.style.setProperty('height', '1px');
//   textArea.style.setProperty('margin-bottom', '-1px');
//   textArea.style.setProperty('margin-right', '-1px');
//   textArea.style.setProperty('max-height', '1px');
//   textArea.style.setProperty('max-width', '1px');
//   textArea.style.setProperty('min-height', '1px');
//   textArea.style.setProperty('min-width', '1px');
//   textArea.style.setProperty('outline-color', 'transparent');
//   textArea.style.setProperty('position', 'absolute');
//   textArea.style.setProperty('width', '1px');
//   document.body.appendChild(textArea);
//   return textArea;
// };

// const removeElement = (element: HTMLElement): void => {
//   element.parentNode!.removeChild(element);
// };

// const read = (): string => {
//   const textArea: HTMLTextAreaElement = createTextArea();
//   textArea.focus();
//   const success = document.execCommand('paste');
//   if (!success) {
//     removeElement(textArea);
//     throw NOT_ALLOWED_ERROR;
//   }
//   const value: string = textArea.value;
//   removeElement(textArea);
//   return value;
// };

// const write = (text: string): void => {
//   const textArea: HTMLTextAreaElement = createTextArea();
//   textArea.value = text;
//   textArea.select();
//   removeElement(textArea);
//   const success: boolean = document.execCommand('copy');
//   console.log('success', success);
//   if (!success) {
//     throw NOT_ALLOWED_ERROR;
//   }
// };

// const useClipboard = () => {
//   const [clipboard, setClipboard] = useState();

//   useEffect((): void | VoidFunction => {
//     if (isClipboardApiEnabled(navigator)) {
//       const navigatorClipboardListener = ({ clipboardData }) => {
//         const dataTransfer = clipboardData || getClipboardData(window) || null;
//         console.log('dataTransfer', dataTransfer);
//         if (dataTransfer) {
//           const text = dataTransfer.getData('text/plain');
//           if (clipboard !== text) {
//             setClipboard(text);
//           }
//         }
//       };

//       navigator.clipboard.addEventListener('copy', navigatorClipboardListener);
//       navigator.clipboard.addEventListener('cut', navigatorClipboardListener);

//       return () => {
//         if (isClipboardApiEnabled(navigator)) {
//           navigator.clipboard.removeEventListener(
//             'copy',
//             navigatorClipboardListener,
//           );
//           navigator.clipboard.removeEventListener(
//             'cut',
//             navigatorClipboardListener,
//           );
//         }
//       };
//     }

//     // function documentClipboardListener(e) {
//     //   try {
//     //     console.log('selection', e);

//     //     const selection = document.getSelection();

//     //     if (selection) {
//     //       setClipboard(selection.toString());
//     //     }
//     //   } catch (_err) {}
//     // }
//     // document.addEventListener('copy', documentClipboardListener); //复制
//     // document.addEventListener('cut', documentClipboardListener); //剪切

//     // return () => {
//     //   document.removeEventListener('copy', documentClipboardListener);
//     //   document.removeEventListener('cut', documentClipboardListener);
//     // };
//   }, [clipboard]);

//   useLayoutEffect((): void => {
//     try {
//       const text = read();
//       if (clipboard !== text) {
//         setClipboard(text);
//       }
//     } catch (_syncErr) {
//       if (isClipboardApiEnabled(navigator)) {
//         (async (): Promise<void> => {
//           try {
//             const text: string = await navigator.clipboard.readText();
//             if (clipboard !== text) {
//               setClipboard(text);
//             }
//           } catch (_asyncErr) {}
//         })();
//       }
//     }
//   }, [clipboard]);

//   const syncClipboard = useCallback(async (text: string): Promise<void> => {
//     try {
//       write(text);
//       setClipboard(text);
//     } catch (e) {
//       if (isClipboardApiEnabled(navigator)) {
//         try {
//           await navigator.clipboard.writeText(text);
//           setClipboard(text);
//         } catch (_err) {}
//       }
//     }
//   }, []);
//   return [clipboard, syncClipboard];
// };

// export default useClipboard;

import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';

/**
 * 用于将文字剪切到用户的剪切板
 * @param {number} successDuration  复制成功后多久变回初始状态
 * @return {[boolean, (str: string) => void]}  [ boolean, (str: string) => void ]
 */
export default function useClipboard(
  successDuration: number = 0,
): [boolean, (str: string) => void] {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied && !!successDuration) {
      const id = setTimeout(() => {
        setIsCopied(false);
      }, successDuration);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isCopied, successDuration]);

  const setText = useCallback((str: string) => {
    const didCopy = copy(str);
    setIsCopied(didCopy);
  }, []);

  return [isCopied, setText];
}
