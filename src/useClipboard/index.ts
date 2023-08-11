import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

interface Clipboard {
  readText(): Promise<string>;
  writeText(text: string): Promise<void>;
}

interface ClipboardDataWindow extends Window {
  clipboardData: DataTransfer | null;
}

type ClipboardEventListener =
  | EventListenerObject
  | null
  | ((event: ClipboardEvent) => void);

interface ClipboardEventTarget extends EventTarget {
  addEventListener(type: 'copy', eventListener: ClipboardEventListener): void;
  addEventListener(type: 'cut', eventListener: ClipboardEventListener): void;
  addEventListener(type: 'paste', eventListener: ClipboardEventListener): void;
  removeEventListener(
    type: 'copy',
    eventListener: ClipboardEventListener,
  ): void;
  removeEventListener(type: 'cut', eventListener: ClipboardEventListener): void;
  removeEventListener(
    type: 'paste',
    eventListener: ClipboardEventListener,
  ): void;
}

interface ClipboardNavigator extends Navigator {
  clipboard: Clipboard & ClipboardEventTarget;
}

type ClipboardTuple = [string, (clipboard: string) => void];

type VoidFunction = () => void;

const hasClipboardData = (w: Window): w is ClipboardDataWindow =>
  Object.prototype.hasOwnProperty.call(w, 'clipboardData');

const getClipboardData = (
  w: ClipboardDataWindow | Window,
): DataTransfer | null => {
  if (hasClipboardData(w)) {
    return w.clipboardData;
  }
  return null;
};

const isClipboardApiEnabled = (
  navigator: Navigator,
): navigator is ClipboardNavigator =>
  typeof navigator === 'object' && typeof navigator.clipboard === 'object';

const NOT_ALLOWED_ERROR = new Error('NotAllowed');

const zeroStyles = (element: HTMLElement, ...properties: string[]): void => {
  for (const property of properties) {
    element.style.setProperty(property, '0');
  }
};

const createTextArea = (): HTMLTextAreaElement => {
  const textArea: HTMLTextAreaElement = document.createElement('textarea');
  textArea.setAttribute('cols', '0');
  textArea.setAttribute('rows', '0');
  zeroStyles(
    textArea,
    'border-width',
    'bottom',
    'margin-left',
    'margin-top',
    'outline-width',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'right',
  );
  textArea.style.setProperty('box-sizing', 'border-box');
  textArea.style.setProperty('height', '1px');
  textArea.style.setProperty('margin-bottom', '-1px');
  textArea.style.setProperty('margin-right', '-1px');
  textArea.style.setProperty('max-height', '1px');
  textArea.style.setProperty('max-width', '1px');
  textArea.style.setProperty('min-height', '1px');
  textArea.style.setProperty('min-width', '1px');
  textArea.style.setProperty('outline-color', 'transparent');
  textArea.style.setProperty('position', 'absolute');
  textArea.style.setProperty('width', '1px');
  document.body.appendChild(textArea);
  return textArea;
};

const removeElement = (element: HTMLElement): void => {
  element.parentNode!.removeChild(element);
};

const read = (): string => {
  const textArea: HTMLTextAreaElement = createTextArea();
  textArea.focus();
  const success: boolean = document.execCommand('paste');
  if (!success) {
    removeElement(textArea);
    throw NOT_ALLOWED_ERROR;
  }
  const value: string = textArea.value;
  removeElement(textArea);
  return value;
};

const write = (text: string): void => {
  const textArea: HTMLTextAreaElement = createTextArea();
  textArea.value = text;
  textArea.select();
  const success: boolean = document.execCommand('copy');
  removeElement(textArea);
  if (!success) {
    throw NOT_ALLOWED_ERROR;
  }
};

const useClipboard = (val = ''): ClipboardTuple => {
  const [clipboard, setClipboard] = useState(val);

  useEffect((): void | VoidFunction => {
    if (isClipboardApiEnabled(navigator)) {
      const navigatorClipboardListener = ({
        clipboardData,
      }: ClipboardEvent) => {
        const dataTransfer: DataTransfer | null =
          clipboardData || getClipboardData(window) || null;
        if (dataTransfer) {
          const text = dataTransfer.getData('text/plain');
          if (clipboard !== text) {
            setClipboard(text);
          }
        }
      };

      navigator.clipboard.addEventListener('copy', navigatorClipboardListener);
      navigator.clipboard.addEventListener('cut', navigatorClipboardListener);

      return () => {
        if (isClipboardApiEnabled(navigator)) {
          navigator.clipboard.removeEventListener(
            'copy',
            navigatorClipboardListener,
          );
          navigator.clipboard.removeEventListener(
            'cut',
            navigatorClipboardListener,
          );
        }
      };
    }

    function documentClipboardListener(): void {
      try {
        const selection: null | Selection = document.getSelection();
        if (selection) {
          setClipboard(selection.toString());
        }
      } catch (_err) {}
    }

    document.addEventListener('copy', documentClipboardListener);
    document.addEventListener('cut', documentClipboardListener);

    return () => {
      document.removeEventListener('copy', documentClipboardListener);
      document.removeEventListener('cut', documentClipboardListener);
    };
  }, [clipboard]);

  const syncClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      write(text);
      setClipboard(text);
    } catch (e) {
      if (isClipboardApiEnabled(navigator)) {
        try {
          await navigator.clipboard.writeText(text);
          setClipboard(text);
        } catch (_err) {}
      }
    }
  }, []);

  useLayoutEffect((): void => {
    try {
      const text: string = read();
      if (clipboard !== text) {
        setClipboard(text);
      }
    } catch (_syncErr) {
      if (isClipboardApiEnabled(navigator)) {
        (async (): Promise<void> => {
          try {
            const text: string = await navigator.clipboard.readText();
            if (clipboard !== text) {
              setClipboard(text);
            }
          } catch (_asyncErr) {}
        })();
      }
    }
  }, [clipboard]);

  return [clipboard, syncClipboard];
};

export default useClipboard;
